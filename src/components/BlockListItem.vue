<template>
  <div class="block-list-item flex min-h-20 items-center justify-start gap-4 overflow-auto">
    <canvas ref="preview-ref" class="size-15 rounded-sm"></canvas>
    <p class="grow">{{ props.block.name }}</p>
    <Button icon="pi pi-trash" size="small" />
  </div>
</template>
<script setup lang="ts">
import { useBlockPreview } from '@/composites'
import type { LevelBlock } from '@/models/level'
import { Button } from 'primevue'
import { useTemplateRef } from 'vue'

const props = defineProps<{
  block: LevelBlock
}>()

const previewRef = useTemplateRef<HTMLCanvasElement>('preview-ref')
useBlockPreview(previewRef, props.block.blockId)
</script>
