<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import type { BlockColor, LevelFloor } from '@/models/level'
import { render } from '@/service/renderer'
import { useTemplateRef, watchEffect } from 'vue'

const props = defineProps<{ object?: LevelFloor; parentColor?: BlockColor }>()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchEffect(() => {
  const canvas = ref.value
  const obj = props.object
  const parentColor = props.parentColor

  if (!canvas) return

  if (!obj) {
    render.unknown(canvas)
  } else {
    render.floor(canvas, obj, parentColor)
  }
})
</script>
