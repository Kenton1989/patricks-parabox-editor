<template>
  <div
    ref="block-grid-ref"
    class="grid"
    :style="{
      backgroundColor: bgColor,
      gridTemplateColumns: `repeat(${focusedBlock?.width ?? 1}, 1fr)`,
      gridTemplateRows: `repeat(${focusedBlock?.height ?? 1},  1fr)`,
    }"
  >
    <BlockCell
      v-for="cell in cells"
      :key="`${cell.x},${cell.y}`"
      :cell="cell"
      :parentColor="focusedBlock?.color"
      :style="{
        'grid-column-start': cell.x + 1,
        'grid-column-end': cell.x + 2,
        'grid-row-start': (focusedBlock?.height ?? 1) - cell.y,
        'grid-row-end': (focusedBlock?.height ?? 1) - cell.y + 1,
      }"
    />
    <div
      v-if="uiStore.cursor.inGrid && isLevelObjectBrush(uiStore.currentBrush)"
      class="pointer-events-none relative z-20 border-2 border-transparent opacity-50"
      :style="{
        'grid-column-start': uiStore.cursor.x + 1,
        'grid-column-end': uiStore.cursor.x + 2,
        'grid-row-start': (focusedBlock?.height ?? 1) - uiStore.cursor.y,
        'grid-row-end': (focusedBlock?.height ?? 1) - uiStore.cursor.y + 1,
      }"
    >
      <LevelObjectCanvas
        class="absolute top-0 right-0 bottom-0 left-0 h-full w-full"
        :object="uiStore.currentBrush"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useFocusedBlock } from '@/composites'
import { color as colorCvt } from '@/service/convertors'
import { floorColor } from '@/service/renderer/factory'
import { computed, useTemplateRef } from 'vue'
import BlockCell from './BlockCell.vue'
import { useMouseInElement, watchImmediate } from '@vueuse/core'
import { useUiStore } from '@/stores/ui'
import LevelObjectCanvas from './level-object/canvas'
import { isLevelObjectBrush } from '@/models/brush'

const { focusedBlock, grid } = useFocusedBlock()

const cells = computed(() => {
  if (!focusedBlock.value || !grid.value) return []

  return grid.value.cells.flat()
})

const bgColor = computed(() =>
  floorColor(colorCvt.blockToColor(focusedBlock.value?.color ?? 'root')),
)

const blockCellRef = useTemplateRef('block-grid-ref')

const { isOutside } = useMouseInElement(blockCellRef)

const uiStore = useUiStore()

watchImmediate(isOutside, (isOutside) => {
  uiStore.cursor = {
    ...uiStore.cursor,
    inGrid: !isOutside,
  }
})
</script>
<style lang="css">
@import '../styles/block-cell.css';
</style>
