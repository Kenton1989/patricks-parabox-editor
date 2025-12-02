<template>
  <div class="flex flex-col gap-1" v-if="layeredObjects.length > 0">
    <LevelObjectInfoCard
      v-for="obj in layeredObjects"
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
import { computed } from 'vue'

const uiStore = useUiStore()

const layeredObjects = computed(() =>
  uiStore.focusedCell ? [...uiStore.focusedCell.layeredObjects].reverse() : [],
)
</script>
