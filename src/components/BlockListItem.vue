<template>
  <div
    class="block-list-item flex min-h-20 items-center justify-start gap-4 overflow-auto transition hover:cursor-pointer"
    :class="{
      'bg-highlight': uiStore.focusedBlockId === block.blockId,
      'hover:bg-emphasis': uiStore.focusedBlockId !== block.blockId,
    }"
    @click="setFocusedBlock"
  >
    <BlockCanvas :blockId="block.blockId" class="size-15 rounded-sm" />
    <p class="grow">{{ props.block.name }}</p>
    <Button icon="pi pi-trash" size="small" severity="danger" />
  </div>
</template>
<script setup lang="ts">
import type { LevelBlock } from '@/models/level'
import { useUiStore } from '@/stores/ui'
import { Button } from 'primevue'
import BlockCanvas from './BlockCanvas.vue'

const props = defineProps<{
  block: LevelBlock
}>()

const uiStore = useUiStore()

const setFocusedBlock = () => {
  uiStore.focusedBlockId = props.block.blockId
}
</script>
