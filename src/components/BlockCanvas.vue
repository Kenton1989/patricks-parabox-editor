<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import { render } from '@/service/renderer'
import { useBlockPreviewsStore } from '@/stores/block-previews'
import { useTemplateRef, watch } from 'vue'

const props = defineProps<{ blockId?: number }>()

const blockPreviews = useBlockPreviewsStore()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')
watch(
  () => [
    ref.value,
    typeof props.blockId === 'number' ? blockPreviews.map.get(props.blockId) : undefined,
  ],
  ([newRef, newPreview]) => {
    if (!newRef) {
      return
    }
    if (!newPreview) {
      render.unknown(newRef)
      return
    }
    render.copy(newRef, newPreview)
  },
)
</script>
