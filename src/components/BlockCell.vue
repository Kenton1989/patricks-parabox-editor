<template>
  <div
    ref="block-cell-ref"
    class="block-cell outline-primary relative border-2"
    :class="{
      overlapping: hasOverlapping,
      'cell-focused': cellFocused,
    }"
    @click="clickCell"
    @dblclick="doubleClickCell"
  >
    <LevelObjectCanvas
      v-for="obj in layeredChildren"
      :key="obj.objId"
      :object="obj"
      class="object-canvas absolute top-0 right-0 bottom-0 left-0 h-full w-full cursor-pointer"
      :parentColor="parentColor"
    />
  </div>
</template>
<script setup lang="ts">
import { type BlockCell, type BlockColor } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { computed, useTemplateRef, watch } from 'vue'
import LevelObjectCanvas from './level-object/canvas'
import { useUiStore } from '@/stores/ui'
import { usePaintBoard } from '@/composites'
import { useMouseInElement } from '@vueuse/core'

const props = defineProps<{ cell: Immutable<BlockCell>; parentColor?: BlockColor }>()

const layeredChildren = computed(() => props.cell.layeredObjects)

const hasOverlapping = computed(() => layeredChildren.value.length >= 2)

const uiStore = useUiStore()

const cellFocused = computed(
  () => uiStore.focusedCell?.x === props.cell.x && uiStore.focusedCell.y === props.cell.y,
)

const paintBoard = usePaintBoard()

const clickCell = () => {
  paintBoard.applyBrush(props.cell)
}

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

const doubleClickCell = () => {
  if (layeredChildren.value.length === 0) return

  const refObj = layeredChildren.value[0]
  if (refObj?.type !== 'Ref') return
  if (refObj.parentId === refObj.referToBlockId) return

  uiStore.focusedBlockId = refObj.referToBlockId
}
</script>
