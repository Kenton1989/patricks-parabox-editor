<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import type { BlockColor, LevelWall } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { render } from '@/service/renderer'
import { watchImmediate } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const props = defineProps<{ object?: Immutable<LevelWall>; parentColor?: BlockColor }>()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchImmediate(
  () => ({
    canvas: ref.value,
    obj: props.object,
    parentColor: props.parentColor ?? 'root',
  }),
  ({ canvas, obj, parentColor }) => {
    if (!canvas) return

    if (!obj || !parentColor) {
      render.unknown(canvas)
    } else {
      render.wall(canvas, obj, parentColor)
    }
  },
)
</script>
