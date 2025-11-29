import { defineStore } from 'pinia'
import { createDefaultLevelHeader, type BlockColor, type LevelHeader } from '@/models/level'
import type { LevelBlock } from '@/models/level/level-block'
import type { RawLevelRoot } from '@/service/game-level/v4'
import { v4 } from '@/service/convertors'
import { useManualRefHistory, useStorage } from '@vueuse/core'
import { computed, watch } from 'vue'
import type { Immutable } from '@/models/utils'
import type { CreateBlockProps, UpdateBlockProps, UpdateHeaderProps } from '@/models/edit'
/*
useLevelStore: directly convert from / to raw level, support undo & redo
- header
- blocks
- objects

useBlockPreviewStore: depends on levelStore and maintain preview of blocks (need to do recursive rendering), disable undo/redo
- blockPreviews: { blockId: canvas }

blockRender: render a block preview
- renderBlockPreviews(blocks: Block[], levelOfDetails)
- renderBlockWithoutRef(blocks: Block)
- renderAllRef(blocks: Block, blockPreviews)
- renderObject(objectProps, blockPreviews)
- renderXXX(canvas, x, y, w, h, props)

useBlock(blockId): depends on levelScore, generate grid for blockId and convert block updates to level updates
- block
- grid: Cell[][]

useUiStore: store UI related info.
- focused block
- focused cell
- brush info
- headerDialogVisible
- initDialogVisible
*/

function patchData<T extends object>(data: T, patch: Partial<T>) {
  let changed = false
  for (const key in patch) {
    if (patch[key] === undefined) continue

    if (data[key] === patch[key]) continue

    changed = true

    data[key] = patch[key]
  }
  return changed
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
    clear,
    commit: _commit,
  } = useManualRefHistory(_level, { clone: true })

  const levelHeader = computed<Immutable<LevelHeader>>(() => _level.value.header)
  let headerChangedSinceCommit = false

  const levelBlocks = computed<Immutable<LevelBlock[]>>(() => _level.value.blocks)
  let blocksChangedSinceCommit = false

  const commitEditHistory = () => {
    if (headerChangedSinceCommit || blocksChangedSinceCommit) {
      _commit()
      headerChangedSinceCommit = blocksChangedSinceCommit = false
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

  const initLevelV4 = (rawLevel: RawLevelRoot) => {
    _level.value.header = v4.toLevelHeader(rawLevel.header)
    _level.value.blocks = v4.bodyToLevelBlocks(rawLevel.body)
    clear()
    commitEditHistory()

    isInitialized.value = true
  }

  const initEmptyLevel = () => {
    _level.value.header = createDefaultLevelHeader()
    _level.value.blocks = []
    clear()
    commitEditHistory()

    isInitialized.value = true
  }

  const clearLevel = () => {
    _level.value.header = createDefaultLevelHeader()
    _level.value.blocks = []
    clear()
    commitEditHistory()

    isInitialized.value = false
  }

  const getBlock = (blockId: number) => {
    return levelBlocks.value.find((b) => b.blockId === blockId)
  }

  const getBlockRef = (blockId: number) => {
    return computed(() => getBlock(blockId))
  }

  const updateBlock = (
    blockId: number,
    blockUpdate: UpdateBlockProps,
    disableCommit?: boolean,
  ): Immutable<LevelBlock> | undefined => {
    const block = _level.value.blocks.find((b) => b.blockId === blockId)
    if (!block) return undefined

    blocksChangedSinceCommit = patchData(block, blockUpdate)

    if (!disableCommit) {
      commitEditHistory()
    }

    return block
  }

  const defaultBlockColor = () => {
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
      color: defaultBlockColor(),
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

    blocksChangedSinceCommit = true
    commitEditHistory()

    return newId
  }

  const deleteBlock = (blockId: number) => {
    const blockIndex = _level.value.blocks.findIndex((b) => b.blockId === blockId)
    if (blockIndex === -1) return

    _level.value.blocks.splice(blockIndex, 1)

    blocksChangedSinceCommit = true
    commitEditHistory()
  }

  const updateHeader = (headerUpdate: UpdateHeaderProps, disableCommit?: boolean) => {
    headerChangedSinceCommit = patchData(_level.value.header, headerUpdate)
    if (!disableCommit) commitEditHistory()
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
    commitEditHistory,
    clearEditHistory: clear,
    canUndo,
    canRedo,

    /*
    levelObjects: LevelObjectMap
    createChild(blockId, ...childProps)
    updateChild(objectId, ...childProps)
    removeChild(objectId)
    moveChild(objectId, x, y)

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
