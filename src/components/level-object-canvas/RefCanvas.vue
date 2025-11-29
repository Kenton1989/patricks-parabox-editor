<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import type { LevelBlock, LevelRef } from '@/models/level'
import { render } from '@/service/renderer'
import { useBlockPreviewsStore } from '@/stores/block-previews'
import { useLevelStore } from '@/stores/level'
import { watchImmediate } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const props = defineProps<{ object?: LevelRef }>()

const levelStore = useLevelStore()
const blockPreviews = useBlockPreviewsStore()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchImmediate(
  () => ({
    canvas: ref.value,
    obj: props.object,
    refSrcBlock:
      props.object?.type === 'Ref' ? levelStore.getBlock(props.object.referToBlockId) : undefined,
    preview:
      props.object?.type === 'Ref' ? blockPreviews.map.get(props.object.referToBlockId) : undefined,
  }),
  ({ canvas, obj, refSrcBlock, preview }) => {
    if (!canvas) return

    if (!refSrcBlock || !preview || !obj) {
      render.unknown(canvas)
    } else {
      render.ref(canvas, obj, refSrcBlock as LevelBlock, preview)
    }
  },
)
</script>
