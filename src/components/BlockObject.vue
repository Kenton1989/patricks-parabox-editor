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
import { usePaintBoard } from '@/stores/paint-board'
import { watch } from 'vue'

const props = defineProps<{
  object: LevelObject
  parentColor?: BlockColor
  canDrag?: boolean
}>()

const paintBoard = usePaintBoard()

const [collected, drag] = useDrag(() => ({
  type: ItemType.LevelObject,
  item: () => ({ objId: props.object.objId }),
  canDrag: () => props.canDrag,
  collect: (monitor) => {
    return {
      isDragging: !!monitor.isDragging(),
    }
  },
}))

watch(
  () => collected.value.isDragging,
  (newVal) => {
    paintBoard.setIsDragging(newVal)
  },
)
</script>
