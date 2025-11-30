<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import type { LevelBoxInfo } from '@/models/level'
import { render } from '@/service/renderer'
import { useTemplateRef, watchEffect } from 'vue'

const props = defineProps<{ object?: LevelBoxInfo }>()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchEffect(() => {
  const canvas = ref.value
  const obj = props.object

  if (!canvas) return

  if (!obj) {
    render.unknown(canvas)
  } else {
    render.box(canvas, obj)
  }
})
</script>
