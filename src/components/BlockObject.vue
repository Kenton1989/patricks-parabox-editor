<template>
  <div>
    <div
      :ref="drag"
      :draggable="canDrag"
      class="relative h-full w-full"
      :class="{
        dragging: collected.isDragging,
      }"
    >
      <LevelObjectCanvas
        :object="object"
        :parentColor="parentColor"
        class="object-canvas absolute top-0 right-0 bottom-0 left-0 h-full w-full"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { BlockColor, LevelObject } from '@/models/level'
import LevelObjectCanvas from './level-object/canvas'
import { useDrag } from 'vue3-dnd'
import { ItemType } from '@/models/utils'

const props = defineProps<{
  object: LevelObject
  parentColor?: BlockColor
  canDrag?: boolean
}>()

const [collected, drag] = useDrag(() => ({
  type: ItemType.LevelObject,
  item: () => ({ objId: props.object.objId }),
  canDrag: () => props.canDrag,
  collect: (monitor) => ({
    isDragging: !!monitor.isDragging(),
  }),
}))
</script>
