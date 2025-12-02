import { defineStore } from 'pinia'
import {
  createDefaultLevelHeader,
  objLayer,
  type ActivePlayerSetting,
  type BlockColor,
  type InfEnterSetting,
  type InfExitSetting,
  type InfSetting,
  type LevelHeader,
  type LevelObject,
  type LevelRef,
  type PlayerLevelObject,
  type PlayerSetting,
} from '@/models/level'
import type { LevelBlock } from '@/models/level/level-block'
import type { RawLevelRoot } from '@/service/game-level/v4'
import { v4 } from '@/service/convertors'
import { useManualRefHistory, useStorage } from '@vueuse/core'
import { computed, watch, type MaybeRef, type Ref } from 'vue'
import type { Immutable } from '@/models/utils'
import type {
  CreateBlockProps,
  CreateObjectProps,
  UpdateBlockProps,
  UpdateHeaderProps,
  UpdateObjectProps,
  UpdateObjectPropsOfType,
} from '@/models/edit'

function tryGetPlayerSettings(obj?: Partial<LevelObject>): ActivePlayerSetting | undefined {
  const setting = (obj as { playerSetting?: PlayerSetting })?.playerSetting
  if (!setting || setting.type !== 'player') return
  return setting
}

function tryGetInfSettings(
  obj: Partial<LevelObject>,
): InfEnterSetting | InfExitSetting | undefined {
  const setting = (obj as { infSetting?: InfSetting }).infSetting
  if (!setting || setting.type === 'noInf') return
  return setting
}

function infLevel(obj: LevelRef) {
  switch (obj.infSetting.type) {
    case 'infExit': // infinity
      return obj.infSetting.level
    case 'infEnter': // epsilon
      return -obj.infSetting.level
    default:
      return 0
  }
}

export const useLevelStore = defineStore('level', () => {
  const isInitialized = useStorage('level.isInitialized', false)

  const _level = useStorage('level', {
    header: createDefaultLevelHeader(),
    blocks: [] as LevelBlock[],
  })

  const {
    undo,
    redo,
    canRedo,
    canUndo,
    clear: _clear,
    commit: _commit,
    last,
  } = useManualRefHistory(_level, { clone: true, capacity: 1000 })

  const levelHeader = computed<Immutable<LevelHeader>>(() => _level.value.header)
  const levelBlocks = computed<Immutable<LevelBlock[]>>(() => _level.value.blocks)

  let _dataChangedSinceCommit = false
  const _markDataChanged = () => (_dataChangedSinceCommit ||= true)

  const levelObjects: Ref<Map<LevelObject['objId'], Immutable<LevelObject>>> = computed(() => {
    const result = new Map<LevelObject['objId'], Immutable<LevelObject>>()
    for (const block of _level.value.blocks) {
      for (const child of block.children) {
        result.set(child.objId, child)
      }
    }
    return result
  })

  const clearEditHistory = () => {
    _clear()

    // commit to ensure at least one record is in history
    _commit()
  }

  const commit = () => {
    _commit()
    _dataChangedSinceCommit = false
  }

  const _commitIfChanged = () => {
    if (!_dataChangedSinceCommit) {
      return
    }

    const lastJson = JSON.stringify(last.value.snapshot)
    const currentJson = JSON.stringify(_level.value)

    if (lastJson === currentJson) return

    commit()
  }

  const _patchData = <DataT extends object>(data: DataT, patch: Partial<DataT>) => {
    for (const key in patch) {
      if (patch[key] === undefined) continue

      if (!(key in data)) continue

      if (data[key] === patch[key]) continue

      _markDataChanged()

      data[key] = patch[key]
    }
  }

  watch(
    () => _level.value.blocks,
    (newValue) => {
      if (isSorted(newValue.map((b) => b.blockId))) return
      const copy = [...newValue]
      _level.value.blocks = copy.sort((b1, b2) => b1.blockId - b2.blockId)
    },
    { immediate: true },
  )

  let _nextObjId = 1
  const _newObjId = () => _nextObjId++
  const _resetObjId = () => {
    const objs = _level.value.blocks.map((b) => b.children).flat()
    if (objs.length === 0) {
      _nextObjId = 1
      return
    }

    const maxObjId = Math.max(...objs.map((o) => o.objId))
    _nextObjId = maxObjId + 1
    console.log('reset next object ID to: ', _nextObjId)
  }

  watch(
    () => _level.value.blocks,
    () => {
      _resetObjId()
    },
    { once: true, immediate: true },
  )

  const _initLevel = (header: LevelHeader, blocks: LevelBlock[]) => {
    _level.value.header = header
    _level.value.blocks = blocks

    _resetObjId()

    clearEditHistory()

    isInitialized.value = true
  }

  const initLevelV4 = (rawLevel: RawLevelRoot) => {
    _initLevel(v4.toLevelHeader(rawLevel.header), v4.bodyToLevelBlocks(rawLevel.body))
  }

  const initEmptyLevel = () => {
    _initLevel(createDefaultLevelHeader(), [])
  }

  const clearLevel = () => {
    _level.value.header = createDefaultLevelHeader()
    _level.value.blocks = []

    clearEditHistory()

    isInitialized.value = false
  }

  const getBlock = (blockId: number) => {
    const result = levelBlocks.value.find((b) => b.blockId === blockId)

    if (!result) console.warn('unknown block ID', blockId)

    return result
  }

  const getBlockRef = (blockId: MaybeRef<number | undefined>) => {
    return typeof blockId === 'number'
      ? computed(() => getBlock(blockId))
      : computed(() => (blockId?.value !== undefined ? getBlock(blockId.value) : undefined))
  }

  const updateBlock = (
    blockId: number,
    blockUpdate: UpdateBlockProps,
    disableCommit?: boolean,
  ): Immutable<LevelBlock> | undefined => {
    const block = getBlock(blockId)
    if (!block) return undefined

    _patchData(block, blockUpdate)

    if (!disableCommit) {
      _commitIfChanged()
    }

    return block
  }

  const _defaultBlockColor = () => {
    const existingColor = new Set(levelBlocks.value.map((b) => b.color))
    for (const defaultColor of ['root', 'color 1', 'color 2', 'color 3'] as BlockColor[]) {
      if (!existingColor.has(defaultColor)) return defaultColor
    }
    return 'root'
  }

  const defaultCreateBlockProps = (blockId: number): CreateBlockProps => {
    return {
      name: `Block ${blockId}`,
      width: 9,
      height: 9,
      color: _defaultBlockColor(),
      zoomFactor: 1,
      children: [],
    }
  }

  const createBlock = (newBlockProps?: CreateBlockProps): number => {
    const newId =
      _level.value.blocks.length > 0
        ? Math.max(..._level.value.blocks.map((b) => b.blockId)) + 1
        : 1

    newBlockProps ??= defaultCreateBlockProps(newId)

    const newBlock = {
      ...newBlockProps,
      blockId: newId,
    }

    _level.value.blocks.push(newBlock)

    commit()

    return newId
  }

  const deleteBlock = (blockId: number) => {
    const blockIndex = _level.value.blocks.findIndex((b) => b.blockId === blockId)
    if (blockIndex === -1) {
      console.warn('unknown block ID:', blockId)
      return
    }

    _level.value.blocks.splice(blockIndex, 1)

    commit()
  }

  const updateHeader = (headerUpdate: UpdateHeaderProps, disableCommit?: boolean) => {
    _patchData(_level.value.header, headerUpdate)
    if (!disableCommit) _commitIfChanged()
  }

  const getObject = (objId: number) => {
    const res = levelObjects.value.get(objId)
    if (!res) {
      console.warn('unknown object ID:', objId)
      return
    }
    return res
  }

  const getObjectRef = (objId: MaybeRef<number>) => {
    return typeof objId === 'number'
      ? computed(() => getObject(objId))
      : computed(() => getObject(objId.value))
  }

  function _ensureOneBlockPerLayer(newObj: LevelObject, parentBlock: LevelBlock) {
    // object on the same layer is mutual exclusive
    const conflictingLayer = objLayer(newObj)
    const newChildren = parentBlock.children.filter(
      (o) =>
        o.x !== newObj.x ||
        o.y !== newObj.y ||
        objLayer(o) != conflictingLayer ||
        o.objId === newObj.objId,
    )

    if (newChildren.length !== parentBlock.children.length) {
      _markDataChanged()
      parentBlock.children = newChildren
    }
  }

  function updateObject<TypeT extends LevelObject['type']>(
    type: TypeT,
    objId: number,
    objUpdate: UpdateObjectPropsOfType<TypeT>,
    disableCommit?: boolean,
  ) {
    const objInMap = getObject(objId)
    if (!objInMap) return

    const existingObj = objInMap.type === type ? (objInMap as LevelObject) : undefined
    if (!existingObj) {
      console.error('object type mismatch. existing:', objInMap.type, 'patch:', type)
      return
    }

    _ensureValidPlayerOrder(objId, objUpdate, existingObj)
    _ensureValidInfEnterId(objId, objUpdate)
    if (existingObj.type === 'Ref' && (objUpdate as UpdateObjectProps<LevelRef>).exitBlock) {
      _ensureSingleExit(existingObj)
    }

    _patchData(existingObj, objUpdate)

    if (objUpdate.x !== undefined || objUpdate.y !== undefined) {
      const parentBlock = getBlock(existingObj.parentId)
      if (parentBlock) {
        _ensureOneBlockPerLayer(existingObj, parentBlock as LevelBlock)
      } else {
        console.error('unknown parent block: ', existingObj.parentId)
      }
    }

    if (!disableCommit) {
      _commitIfChanged()
    }

    return existingObj as Immutable<LevelObject>
  }

  const deleteObject = (objId: number, disableCommit?: boolean) => {
    const objInMap = getObject(objId)
    if (!objInMap) return

    const parentBlock = getBlock(objInMap.parentId) as LevelBlock | undefined
    if (!parentBlock) return

    const childIndex = parentBlock.children.findIndex((o) => o.objId === objId)
    if (childIndex < 0) {
      console.error('deleteObject cannot find child object', objId, 'in', parentBlock)
      return
    }
    parentBlock.children.splice(childIndex, 1)

    if (!disableCommit) {
      commit()
    } else {
      _markDataChanged()
    }

    return objInMap
  }

  const _isValidPlayerOrder = (objId: number, playerOrder: number) => {
    return (
      playerOrder &&
      players.value.every((p) => {
        const res = p.objId === objId || p.playerSetting.playerOrder !== playerOrder
        return res
      })
    )
  }

  const _newPlayerOrder = () => {
    return players.value.length === 0
      ? 1
      : Math.max(...players.value.map((p) => p.playerSetting.playerOrder)) + 1
  }

  const _ensureValidPlayerOrder = (
    objId: number,
    obj: Partial<LevelObject>,
    existingObj?: LevelObject,
  ) => {
    const playerSetting = tryGetPlayerSettings(obj)

    if (playerSetting && !_isValidPlayerOrder(objId, playerSetting.playerOrder)) {
      const existingPlayerSetting = tryGetPlayerSettings(existingObj)
      const newOrder = existingPlayerSetting ? existingPlayerSetting.playerOrder : _newPlayerOrder()
      console.log('fix player order of', objId, 'from', playerSetting.playerOrder, 'to', newOrder)
      playerSetting.playerOrder = newOrder
    }
  }

  const _ensureValidInfEnterId = (objId: number, obj: Partial<LevelObject>) => {
    const refSetting = tryGetInfSettings(obj)
    if (!refSetting) return

    if (refSetting.level <= 0) refSetting.level = 1

    if (refSetting.type !== 'infEnter') return

    const infEnterFromBlk = getBlock(refSetting.enterFromBlockId)

    if (infEnterFromBlk) {
      // valid
      return
    }

    console.warn('ensureCorrectInfEnterId: invalid epsilon entrance', refSetting.enterFromBlockId)

    if (levelBlocks.value.length === 0) {
      console.error('ensureCorrectInfEnterId: no blocks exists')
      return
    }

    console.log(
      'adjust epsilon entrance from',
      refSetting.enterFromBlockId,
      'to',
      levelBlocks.value[0]!.blockId,
    )
    refSetting.enterFromBlockId = levelBlocks.value[0]!.blockId
  }

  const upsertObject = (objProps: CreateObjectProps, disableCommit?: boolean) => {
    const parentBlock = getBlock(objProps.parentId) as LevelBlock
    if (!parentBlock) {
      console.error('upsertObject: unknown parent', objProps.parentId)
      return
    }

    const existingBlock = parentBlock.children.find(
      (o) => o.type === objProps.type && o.x === objProps.x && o.y === objProps.y,
    )
    if (existingBlock) {
      updateObject(existingBlock.type, existingBlock.objId, objProps, disableCommit)
      return
    }

    const objId = _newObjId()
    const newObj: LevelObject = { objId, ...objProps }

    _ensureValidPlayerOrder(objId, newObj)
    _ensureValidInfEnterId(objId, newObj)
    if (newObj.type === 'Ref') _ensureSingleExit(newObj)

    parentBlock.children.push(newObj)
    _ensureOneBlockPerLayer(newObj, parentBlock)

    if (!disableCommit) {
      commit()
    } else {
      _markDataChanged()
    }

    return newObj
  }

  const players = computed(() => {
    const result = [...levelObjects.value.values()].filter(
      (o) => o.type !== 'Floor' && o.playerSetting.type === 'player',
    ) as PlayerLevelObject[]

    result.sort(
      (p1: PlayerLevelObject, p2: PlayerLevelObject) =>
        p1.playerSetting.playerOrder - p2.playerSetting.playerOrder,
    )

    return result
  })

  const _ensureSingleExit = (refObj: LevelRef) => {
    if (!refObj.exitBlock) {
      refObj.exitBlock = true
      _markDataChanged()
    }

    for (const obj of levelObjects.value.values()) {
      if (obj.objId === refObj.objId) continue
      if (obj.type !== 'Ref') continue
      if (obj.referToBlockId !== refObj.referToBlockId) continue
      if (infLevel(refObj) !== infLevel(obj)) continue
      if (!obj.exitBlock) continue
      ;(obj as LevelRef).exitBlock = false
      _markDataChanged()
    }
  }

  // set ref object to the only exit of the block
  // all the other ref to the same block will become clone
  const setExitRef = (refObjId: number) => {
    const inputObj = getObject(refObjId)
    if (!inputObj) return

    if (inputObj.type !== 'Ref') {
      console.error('setExitRef received non-ref ID:', refObjId)
      return
    }

    const refObj = inputObj as LevelRef

    _ensureSingleExit(refObj)

    _commitIfChanged()
  }

  const getObjectsByCell = (blockId: number, x: number, y: number): Immutable<LevelObject[]> => {
    const block = getBlock(blockId)
    if (!block) return []

    return block.children.filter((o) => o.x === x && o.y === y)
  }

  return {
    _level,

    isInitialized,
    levelHeader,
    levelBlocks,

    initLevelV4,
    initEmptyLevel,
    clearLevel,

    updateHeader,

    getBlock,
    getBlockRef,
    updateBlock,
    createBlock,
    deleteBlock,

    undo,
    redo,
    commitEditHistory: _commitIfChanged,
    clearEditHistory,
    canUndo,
    canRedo,

    levelObjects,
    getObject,
    getObjectsByCell,
    getObjectRef,
    updateObject,
    deleteObject,
    upsertObject,
    setExitRef,

    players,

    /*
    setOutgoingRef(blockId, refObjectId)

    orderedPlayers
    turnIntoPlayer(objectId)
    setPlayerOrder(...objectIds)
    */
  }
})

function isSorted(list: number[]): boolean {
  for (let i = 1; i < list.length; ++i) {
    if (list[i - 1]! > list[i]!) return false
  }
  return true
}
