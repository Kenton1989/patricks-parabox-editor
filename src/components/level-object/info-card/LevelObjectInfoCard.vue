<template>
  <WallInfoCard v-if="props.object?.type === 'Wall'" :object="cast.wall(object)" />
  <RefInfoCard v-else-if="props.object?.type === 'Ref'" :object="cast.ref(object)" />
  <BoxInfoCard v-else-if="props.object?.type === 'Box'" :object="cast.box(object)" />
  <FloorInfoCard v-else-if="props.object?.type === 'Floor'" :object="cast.floor(object)" />
  <EmptyCellInfoCard v-else />
</template>
<script setup lang="ts">
import { cast, type LevelObject } from '@/models/level'
import WallInfoCard from './WallInfoCard.vue'
import RefInfoCard from './RefInfoCard.vue'
import BoxInfoCard from './BoxInfoCard.vue'
import FloorInfoCard from './FloorInfoCard.vue'
import EmptyCellInfoCard from './EmptyCellInfoCard.vue'

const props = defineProps<{ object?: LevelObject }>()
</script>
