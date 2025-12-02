<template>
  <div
    class="flex items-center justify-center p-8"
    :class="{
      [`${uiStore.currentBrush.type.toLocaleLowerCase()}-brush-active`]: true,
      'dragging-in-progress': paintBoard.isDragging,
    }"
  >
    <FocusedBlockCellGrid class="aspect-square h-full" />
  </div>
</template>
<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import FocusedBlockCellGrid from './FocusedBlockCellGrid.vue'
import { usePaintBoard } from '@/stores/paint-board'
import { watch } from 'vue'

const uiStore = useUiStore()
const paintBoard = usePaintBoard()

watch(
  () => paintBoard.isDragging,
  () => {
    console.log(paintBoard)
  },
)
</script>
