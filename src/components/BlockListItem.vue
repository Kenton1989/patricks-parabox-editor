<template>
  <div class="block-list-item flex min-h-20 justify-start align-middle">
    <canvas ref="preview-ref" class="size-15 rounded-xs"></canvas>
    <p>
      {{ props.block.name }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { useBlockPreview } from '@/composites'
import type { LevelBlock } from '@/models/level'
import { useTemplateRef } from 'vue'

const props = defineProps<{
  block: LevelBlock
}>()

const previewRef = useTemplateRef<HTMLCanvasElement>('preview-ref')

useBlockPreview(previewRef, props.block.blockId)
</script>
