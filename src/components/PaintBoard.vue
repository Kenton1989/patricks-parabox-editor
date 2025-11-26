<template>
  <div class="flex items-center justify-center p-10">
    <BlockCanvas :blockId="uiStore.focusedBlockId" class="h-full" />
  </div>
</template>
<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import BlockCanvas from './BlockCanvas.vue'

const uiStore = useUiStore()
</script>
