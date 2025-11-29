<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import type { LevelBox } from '@/models/level'
import { render } from '@/service/renderer'
import { watchImmediate } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const props = defineProps<{ object?: LevelBox }>()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchImmediate(
  () => ({
    canvas: ref.value,
    obj: props.object,
  }),
  ({ canvas, obj }) => {
    if (!canvas) return

    if (!obj) {
      render.unknown(canvas)
    } else {
      render.box(canvas, obj)
    }
  },
)
</script>
