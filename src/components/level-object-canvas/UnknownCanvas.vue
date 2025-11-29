<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import { render } from '@/service/renderer'
import { watchImmediate } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchImmediate(ref, (canvas) => {
  if (!canvas) return

  render.unknown(canvas)
})
</script>
