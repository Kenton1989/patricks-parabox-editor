<template>
  <div
    ref="cell-ref"
    class="relative border-2"
    :style="{ borderColor: cellBorderColor }"
    @click="selectCell"
  >
    <LevelObjectCanvas
      v-if="objOnTheFloor"
      :style="{ zIndex: baseZIndex + 1, textAlign: 'right' }"
      class="absolute top-0 right-0 bottom-0 left-0 h-full w-full"
      :object="objOnTheFloor"
      :parentColor="parentColor"
    />
    <FloorCanvas
      v-if="floor"
      class="absolute top-0 right-0 bottom-0 left-0 h-full w-full"
      :object="floor"
    />
    <div v-else class="absolute top-0 right-0 bottom-0 left-0 h-full w-full"></div>
  </div>
</template>
<script setup lang="ts">
import type { BlockCell, BlockColor } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { computed, useTemplateRef } from 'vue'
import LevelObjectCanvas, { FloorCanvas } from './level-object/canvas'
import { useUiStore } from '@/stores/ui'

const props = defineProps<{ cell: Immutable<BlockCell>; parentColor?: BlockColor }>()

const cellRef = useTemplateRef('cell-ref')

const baseZIndex = computed(() =>
  cellRef.value?.style?.zIndex ? Number(cellRef.value?.style?.zIndex) : 0,
)

const floor = computed(() => props.cell.objects.find((o) => o.type === 'Floor'))
const objOnTheFloor = computed(() => props.cell.objects.find((o) => o.type !== 'Floor'))

const cellBorderColor = computed(() => (objOnTheFloor.value && floor.value ? 'white' : 'black'))

const uiStore = useUiStore()

const selectCell = () => {
  uiStore.focusedCellInfo = {
    x: props.cell.x,
    y: props.cell.y,
    objects: [objOnTheFloor.value, floor.value].filter((o) => o !== undefined),
  }
}
</script>
