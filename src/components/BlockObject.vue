<template>
  <div ref="elementRef" :draggable="canDrag">
    <LevelObjectCanvas
      :object="object"
      :parentColor="parentColor"
      class="object-canvas absolute top-0 right-0 bottom-0 left-0 h-full w-full"
    />
  </div>
</template>
<script setup lang="ts">
import type { BlockColor, LevelObject } from '@/models/level'
import LevelObjectCanvas from './level-object/canvas'

defineProps<{
  object: LevelObject
  parentColor?: BlockColor
  canDrag?: boolean
}>()
</script>
