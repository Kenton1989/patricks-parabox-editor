<template>
  <canvas ref="preview-ref" class="block" />
</template>
<script setup lang="ts">
import type { BlockColor, LevelWall } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { render } from '@/service/renderer'
import { useTemplateRef, watchEffect } from 'vue'

const props = defineProps<{ object?: Immutable<LevelWall>; parentColor?: BlockColor }>()

const ref = useTemplateRef<HTMLCanvasElement>('preview-ref')

watchEffect(() => {
  const canvas = ref.value
  const obj = props.object
  const parentColor = props.parentColor ?? 'root'

  if (!canvas) return

  if (!obj || !parentColor) {
    render.unknown(canvas)
  } else {
    render.wall(canvas, obj, parentColor)
  }
})
</script>
