<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import type { LevelBlock, LevelRef } from '@/models/level'
import { render } from '@/service/renderer'
import { useBlockPreviewsStore } from '@/stores/block-previews'
import { useLevelStore } from '@/stores/level'
import { useTemplateRef, watchEffect } from 'vue'

const props = defineProps<{ object?: LevelRef }>()

const levelStore = useLevelStore()
const blockPreviews = useBlockPreviewsStore()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchEffect(() => {
  const canvas = ref.value
  const obj = props.object
  const refSrcBlock =
    props.object?.type === 'Ref' ? levelStore.getBlock(props.object.referToBlockId) : undefined
  const preview =
    props.object?.type === 'Ref' ? blockPreviews.map.get(props.object.referToBlockId) : undefined

  if (!canvas) return

  if (!refSrcBlock || !preview || !obj) {
    render.unknown(canvas)
  } else {
    render.ref(canvas, obj, refSrcBlock as LevelBlock, preview)
  }
})
</script>
