<template>
  <div class="flex items-center justify-center p-8">
    <BlockCellGrid :blockId="uiStore.focusedBlockId" class="aspect-square h-full" />
  </div>
</template>
<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import BlockCellGrid from './BlockCellGrid.vue'

const uiStore = useUiStore()
</script>
