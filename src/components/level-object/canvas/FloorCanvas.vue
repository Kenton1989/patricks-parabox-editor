<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import type { BlockColor, LevelFloor } from '@/models/level'
import { render } from '@/service/renderer'
import { watchImmediate } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const props = defineProps<{ object?: LevelFloor; parentColor?: BlockColor }>()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchImmediate(
  () => ({
    canvas: ref.value,
    obj: props.object,
    parentColor: props.parentColor,
  }),
  ({ canvas, obj, parentColor }) => {
    if (!canvas) return

    if (!obj) {
      render.unknown(canvas)
    } else {
      render.floor(canvas, obj, parentColor)
    }
  },
)
</script>
