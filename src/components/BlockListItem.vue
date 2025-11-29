<template>
  <div
    class="block-list-item flex min-h-20 items-center justify-start gap-4 transition hover:cursor-pointer"
    :class="{
      'bg-highlight': uiStore.focusedBlockId === block.blockId,
      'hover:bg-emphasis': uiStore.focusedBlockId !== block.blockId,
    }"
    @click="setFocusedBlock"
  >
    <BlockCanvas :blockId="block.blockId" class="size-15 rounded-sm" />
    <p class="grow">{{ props.block.name }}</p>
    <Button icon="pi pi-trash" size="small" severity="danger" @click.stop="deleteBlock" />
  </div>
</template>
<script setup lang="ts">
import type { LevelBlock } from '@/models/level'
import { useUiStore } from '@/stores/ui'
import { Button } from 'primevue'
import BlockCanvas from './BlockCanvas.vue'
import type { Immutable } from '@/models/utils'
import { useLevelStore } from '@/stores/level'

const props = defineProps<{
  block: Immutable<LevelBlock>
}>()

const uiStore = useUiStore()
const levelStore = useLevelStore()

const setFocusedBlock = () => {
  uiStore.focusedBlockId = props.block.blockId
}

const deleteBlock = () => {
  const isFocusedBlock = uiStore.focusedBlockId === props.block.blockId
  const originalIndex = levelStore.levelBlocks.findIndex((b) => b.blockId === props.block.blockId)

  levelStore.deleteBlock(props.block.blockId)

  if (!isFocusedBlock) return

  const blocks = levelStore.levelBlocks

  const newSelectedBlockId =
    blocks.length === 0
      ? 0
      : originalIndex >= blocks.length
        ? blocks[blocks.length - 1]!.blockId
        : blocks[originalIndex]!.blockId

  uiStore.focusedBlockId = newSelectedBlockId
}
</script>
