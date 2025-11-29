import type { UpdateBlockProps } from '@/models/edit'
import type { BlockCell, BlockGrid, LevelBlock, LevelObject } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { useLevelStore } from '@/stores/level'
import { computed, type ComputedRef, type Ref } from 'vue'

function range(size: number): number[] {
  return [...Array(size).keys()]
}

function generateGrid(block: Immutable<LevelBlock>): BlockGrid {
  const cells: BlockCell[][] = range(block.width).map((x) =>
    range(block.height).map((y) => {
      return {
        x,
        y,
        objects: [],
      }
    }),
  )
  const outliers: LevelObject[] = []

  for (const obj of block.children) {
    const { x, y } = obj
    if (x < block.width && y < block.height && x >= 0 && y >= 0) {
      cells[x]![y]!.objects.push(obj)
    } else {
      outliers.push(obj)
    }
  }

  return {
    blockId: block.blockId,
    cells,
    outliers,
  }
}

function useBlock(blockId: Ref<number>, withoutGrid?: boolean) {
  const levelStore = useLevelStore()

  const block = levelStore.getBlockRef(blockId)

  const update = (values: UpdateBlockProps) => {
    levelStore.updateBlock(blockId.value, values)
  }

  const updateNoCommit = (values: UpdateBlockProps) => {
    levelStore.updateBlock(blockId.value, values, true)
  }

  const grid: ComputedRef<Immutable<BlockGrid>> = computed(() =>
    block.value && !withoutGrid
      ? generateGrid(block.value)
      : { blockId: blockId.value, cells: [], outliers: [] },
  )

  return { block, update, commit: levelStore.commitEditHistory, updateNoCommit, grid }
}

export default useBlock
