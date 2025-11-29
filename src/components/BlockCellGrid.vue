<template>
  <div
    class="grid"
    :style="{
      backgroundColor: bgColor,
      gridTemplateColumns: `repeat(${block?.width ?? 1}, 1fr)`,
      gridTemplateRows: `repeat(${block?.height ?? 1},  1fr)`,
    }"
  >
    <BlockCell
      v-for="cell in cellsOrderedForGridLayout"
      :key="`${cell.x},${cell.y}`"
      :cell="cell"
    />
  </div>
</template>
<script lang="ts" setup>
import { useBlock } from '@/composites'
import { color as colorCvt } from '@/service/convertors'
import { floorColor } from '@/service/renderer/factory'
import { computed } from 'vue'
import BlockCell from './BlockCell.vue'
import type { BlockCell as BlockCellModel } from '@/models/level'
import type { Immutable } from '@/models/utils'

const props = defineProps<{
  blockId: number
}>()

const { block, grid } = useBlock(computed(() => props.blockId))

const cellsOrderedForGridLayout = computed(() => {
  if (!block.value || !grid.value) return []

  const height = block.value.height
  const width = block.value.width

  const result: Immutable<BlockCellModel>[] = []

  for (let y = height - 1; y >= 0; --y) {
    for (let x = 0; x < width; x++) {
      result.push(grid.value.cells[x]![y]!)
    }
  }

  return result
})

const bgColor = computed(() => floorColor(colorCvt.blockToColor(block.value?.color ?? 'root')))
</script>
