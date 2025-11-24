import { defineStore } from 'pinia'
import { createDefaultLevelHeader } from '@/models/level'
import type { LevelBlock } from '@/models/level/level-block'
import type { RawLevelRoot } from '@/service/game-level/v4'
import { v4 } from '@/service/convertors'
import { useStorage } from '@vueuse/core'
import { watch } from 'vue'
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

export const useLevelStore = defineStore('level', () => {
  const isInitialized = useStorage('level.isInitialized', false)

  const levelHeader = useStorage('level.levelHeader', createDefaultLevelHeader())

  const levelBlocks = useStorage<LevelBlock[]>('level.levelBlocks', [])
  watch(
    levelBlocks,
    (newValue) => {
      if (isSorted(newValue.map((b) => b.blockId))) return
      const copy = [...newValue]
      levelBlocks.value = copy.sort((b1, b2) => b1.blockId - b2.blockId)
    },
    { immediate: true },
  )

  const initLevelV4 = (rawLevel: RawLevelRoot) => {
    levelHeader.value = v4.toLevelHeader(rawLevel.header)
    levelBlocks.value = v4.bodyToLevelBlocks(rawLevel.body)
    isInitialized.value = true
  }

  const initEmptyLevel = () => {
    levelHeader.value = createDefaultLevelHeader()
    levelBlocks.value = []
    isInitialized.value = true
  }

  const clearLevel = () => {
    levelHeader.value = createDefaultLevelHeader()
    levelBlocks.value = []
    isInitialized.value = false
  }

  return {
    isInitialized,
    levelHeader,
    levelBlocks,

    initLevelV4,
    initEmptyLevel,
    clearLevel,
    /*
    - resetUndoStack

    updateHeader(...props)

    createBlock(...props)
    updateBlock(blockId, ...props)
    deleteBlock(blockId)

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
