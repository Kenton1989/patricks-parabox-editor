<template>
  <div
    ref="block-cell-ref"
    class="block-cell outline-primary relative border-2"
    :class="{
      overlapping: hasOverlapping,
      'cell-focused': cellFocused,
    }"
    @mousedown="handleMouseDown"
    @click="handleClick"
    @dblclick="doubleClickCell"
    @dragstart="handleCellStartDrag"
  >
    <BlockObject
      v-for="obj in layeredChildren"
      :key="obj.objId"
      :object="obj"
      :parentColor="parentColor"
      :canDrag="isObjDraggable(obj.objId) && draggable"
      class="absolute top-0 right-0 bottom-0 left-0 h-full w-full"
    />
  </div>
</template>
<script setup lang="ts">
import { type BlockCell, type BlockColor } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { computed, useTemplateRef, watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useMouseInElement } from '@vueuse/core'
import { usePaintBoard } from '@/stores/paint-board'
import { last } from '@/service/utils'
import BlockObject from './BlockObject.vue'

const props = defineProps<{ cell: Immutable<BlockCell>; parentColor?: BlockColor }>()

const layeredChildren = computed(() => props.cell.layeredObjects)

const hasOverlapping = computed(() => layeredChildren.value.length >= 2)

const uiStore = useUiStore()
const paintBoard = usePaintBoard()

const cellFocused = computed(
  () => uiStore.focusedCell?.x === props.cell.x && uiStore.focusedCell.y === props.cell.y,
)

const blockCellRef = useTemplateRef('block-cell-ref')

const { isOutside } = useMouseInElement(blockCellRef)

watch(isOutside, (isOutside) => {
  if (!isOutside) {
    uiStore.cursor = {
      ...uiStore.cursor,
      x: props.cell.x,
      y: props.cell.y,
    }
  }
})

const handleClick = () => {
  if (uiStore.currentBrush.type !== 'Select') return
  paintBoard.applyBrush(props.cell)
}

const handleMouseDown = (e: MouseEvent) => {
  if (uiStore.currentBrush.type === 'Select') return
  paintBoard.startDrawing(e)
}

const doubleClickCell = () => {
  if (layeredChildren.value.length === 0) return

  const refObj = layeredChildren.value[0]
  if (refObj?.type !== 'Ref') return
  if (refObj.parentId === refObj.referToBlockId) return

  uiStore.focusedBlockId = refObj.referToBlockId
}

const draggable = computed(() => uiStore.currentBrush.type === 'Select')

const isObjDraggable = (objId: number) => {
  return last(layeredChildren.value)?.objId === objId
}

const handleCellStartDrag = (e: DragEvent) => {
  if (!draggable.value || props.cell.layeredObjects.length === 0) {
    e.preventDefault()
  }
}
</script>
