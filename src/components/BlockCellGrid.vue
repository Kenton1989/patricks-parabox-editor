<template>
  <div
    ref="block-grid-ref"
    class="grid"
    :style="{
      backgroundColor: bgColor,
      gridTemplateColumns: `repeat(${block?.width ?? 1}, 1fr)`,
      gridTemplateRows: `repeat(${block?.height ?? 1},  1fr)`,
    }"
  >
    <BlockCell
      v-for="cell in cells"
      :key="`${cell.x},${cell.y}`"
      :cell="cell"
      :parentColor="block?.color"
      :style="{
        'grid-column-start': cell.x + 1,
        'grid-column-end': cell.x + 2,
        'grid-row-start': (block?.height ?? 1) - cell.y,
        'grid-row-end': (block?.height ?? 1) - cell.y + 1,
      }"
    />
    <div
      v-if="uiStore.cursor.inGrid"
      class="pointer-events-none relative z-20 border-2 border-transparent opacity-10"
      :style="{
        'grid-column-start': uiStore.cursor.x + 1,
        'grid-column-end': uiStore.cursor.x + 2,
        'grid-row-start': (block?.height ?? 1) - uiStore.cursor.y,
        'grid-row-end': (block?.height ?? 1) - uiStore.cursor.y + 1,
      }"
    >
      <LevelObjectCanvas class="absolute top-0 right-0 bottom-0 left-0 h-full w-full" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useBlock } from '@/composites'
import { color as colorCvt } from '@/service/convertors'
import { floorColor } from '@/service/renderer/factory'
import { computed, useTemplateRef, watch } from 'vue'
import BlockCell from './BlockCell.vue'
import { useMouseInElement } from '@vueuse/core'
import { useUiStore } from '@/stores/ui'
import LevelObjectCanvas from './level-object/canvas'

const props = defineProps<{
  blockId: number
}>()

const { block, grid } = useBlock(computed(() => props.blockId))

const cells = computed(() => {
  if (!block.value || !grid.value) return []

  return grid.value.cells.flat()
})

const bgColor = computed(() => floorColor(colorCvt.blockToColor(block.value?.color ?? 'root')))

const blockCellRef = useTemplateRef('block-grid-ref')

const { isOutside } = useMouseInElement(blockCellRef)

const uiStore = useUiStore()

watch(isOutside, (isOutside) => {
  uiStore.cursor = {
    ...uiStore.cursor,
    inGrid: !isOutside,
  }
})
</script>
<style lang="css">
@import '../styles/block-cell.css';
</style>
