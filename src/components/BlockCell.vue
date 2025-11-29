<template>
  <div ref="cell-ref" class="relative border-2" :style="{ borderColor: cellBorderColor }">
    <div
      v-if="objOnTheFloor"
      :style="{ zIndex: baseZIndex + 1, textAlign: 'right' }"
      class="absolute top-0 right-0 bottom-0 left-0 h-full w-full"
    >
      {{ objOnTheFloor.type }}
    </div>
    <div v-if="floor" class="absolute top-0 right-0 bottom-0 left-0 h-full w-full">
      {{ floor.type }}
    </div>
    <div v-else class="absolute top-0 right-0 bottom-0 left-0 h-full w-full"></div>
  </div>
</template>
<script setup lang="ts">
import type { BlockCell } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { computed, useTemplateRef } from 'vue'

const props = defineProps<{ cell: Immutable<BlockCell> }>()

const cellRef = useTemplateRef('cell-ref')

const baseZIndex = computed(() =>
  cellRef.value?.style?.zIndex ? Number(cellRef.value?.style?.zIndex) : 0,
)

const floor = computed(() => props.cell.objects.find((o) => o.type === 'Floor'))
const objOnTheFloor = computed(() => props.cell.objects.find((o) => o.type !== 'Floor'))

const cellBorderColor = computed(() => (objOnTheFloor.value && floor.value ? 'white' : 'black'))
</script>
