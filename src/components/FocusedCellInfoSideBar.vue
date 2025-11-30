<template>
  <div
    class="flex flex-col-reverse gap-1"
    v-if="uiStore.focusedCellInfo && uiStore.focusedCellInfo.objLayers.length"
  >
    <LevelObjectInfoCard
      v-for="obj in uiStore.focusedCellInfo.objLayers"
      class="w-full grow basis-1"
      :object="obj"
      :key="obj.objId"
    />
  </div>
  <EmptyCellInfoCard v-else />
</template>
<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import LevelObjectInfoCard, { EmptyCellInfoCard } from './level-object/info-card'

const uiStore = useUiStore()
</script>
