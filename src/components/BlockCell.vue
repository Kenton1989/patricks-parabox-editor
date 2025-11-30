<template>
  <div
    class="outline-primary relative border-2"
    :class="{
      'outline-4': shouldHighlightFocus,
    }"
    :style="{ borderColor: hasOverlapping, zIndex: shouldHighlightFocus ? 10 : 0 }"
    @click="selectCell"
    @dblclick="doubleClickCell"
  >
    <LevelObjectCanvas
      v-for="obj in layeredChildren"
      :key="obj.objId"
      :object="obj"
      class="absolute top-0 right-0 bottom-0 left-0 h-full w-full cursor-pointer"
      :parentColor="parentColor"
    />
  </div>
</template>
<script setup lang="ts">
import { toObjsSortedByLayer, type BlockCell, type BlockColor } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { computed } from 'vue'
import LevelObjectCanvas from './level-object/canvas'
import { useUiStore } from '@/stores/ui'

const props = defineProps<{ cell: Immutable<BlockCell>; parentColor?: BlockColor }>()

const layeredChildren = computed(() => toObjsSortedByLayer([...props.cell.objects]))

const hasOverlapping = computed(() => (layeredChildren.value.length >= 2 ? 'white' : 'black'))

const uiStore = useUiStore()

const canFocus = computed(() => layeredChildren.value.length > 0)

const shouldHighlightFocus = computed(
  () =>
    canFocus.value &&
    uiStore.focusedCellInfo?.x === props.cell.x &&
    uiStore.focusedCellInfo.y === props.cell.y,
)

const selectCell = () => {
  if (layeredChildren.value.length === 0) uiStore.focusedCellInfo = undefined

  uiStore.focusedCellInfo = {
    x: props.cell.x,
    y: props.cell.y,
    objLayers: layeredChildren.value,
  }
}

const doubleClickCell = () => {
  if (layeredChildren.value.length === 0) return

  const refObj = layeredChildren.value[0]
  if (refObj?.type !== 'Ref') return
  if (refObj.parentId === refObj.referToBlockId) return

  uiStore.focusedBlockId = refObj.referToBlockId
}
</script>
