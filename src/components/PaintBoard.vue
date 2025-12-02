<template>
  <div
    class="flex items-center justify-center p-8"
    :class="{
      [`${uiStore.currentBrush.type.toLocaleLowerCase()}-brush-active`]: true,
    }"
  >
    <FocusedBlockCellGrid class="aspect-square h-full" />
  </div>
</template>
<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import FocusedBlockCellGrid from './FocusedBlockCellGrid.vue'

const uiStore = useUiStore()
</script>
