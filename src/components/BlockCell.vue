<template>
  <div
    class="outline-primary relative border-2"
    :class="{
      'outline-4': isFocused,
    }"
    :style="{ borderColor: cellBorderColor, zIndex: isFocused ? 10 : 0 }"
  >
    <LevelObjectCanvas
      v-if="objOnTheFloor"
      :style="{ zIndex: 1, textAlign: 'right' }"
      class="absolute top-0 right-0 bottom-0 left-0 h-full w-full cursor-pointer"
      :object="objOnTheFloor"
      :parentColor="parentColor"
      @click="selectCell"
      @dblclick="doubleClickCell"
    />
    <FloorCanvas
      v-if="floor"
      class="absolute top-0 right-0 bottom-0 left-0 h-full w-full cursor-pointer"
      :object="floor"
      @click="selectCell"
    />
    <div v-else class="absolute top-0 right-0 bottom-0 left-0 h-full w-full"></div>
  </div>
</template>
<script setup lang="ts">
import type { BlockCell, BlockColor } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { computed } from 'vue'
import LevelObjectCanvas, { FloorCanvas } from './level-object/canvas'
import { useUiStore } from '@/stores/ui'

const props = defineProps<{ cell: Immutable<BlockCell>; parentColor?: BlockColor }>()

const floor = computed(() => props.cell.objects.find((o) => o.type === 'Floor'))
const objOnTheFloor = computed(() => props.cell.objects.find((o) => o.type !== 'Floor'))

const isFocused = computed(
  () => uiStore.focusedCellInfo?.x === props.cell.x && uiStore.focusedCellInfo.y === props.cell.y,
)

const cellBorderColor = computed(() => (objOnTheFloor.value && floor.value ? 'white' : 'black'))

const uiStore = useUiStore()

const selectCell = () => {
  uiStore.focusedCellInfo = {
    x: props.cell.x,
    y: props.cell.y,
    objects: [objOnTheFloor.value, floor.value].filter((o) => o !== undefined),
  }
}

const doubleClickCell = () => {
  if (!objOnTheFloor.value || objOnTheFloor.value.type !== 'Ref') {
    return
  }
  const refObj = objOnTheFloor.value
  if (refObj.parentId === refObj.referToBlockId) return

  uiStore.focusedBlockId = refObj.referToBlockId
}
</script>
