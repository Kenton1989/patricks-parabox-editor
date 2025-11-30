<template>
  <WallCanvas
    v-if="props.object?.type === 'Wall'"
    :object="(object as LevelWallInfo)"
    :parentColor="parentColor"
  />
  <RefCanvas v-else-if="props.object?.type === 'Ref'" :object="(object as LevelRefInfo)" />
  <BoxCanvas v-else-if="props.object?.type === 'Box'" :object="(object as LevelBoxInfo)" />
  <FloorCanvas v-else-if="props.object?.type === 'Floor'" :object="(object as LevelFloorInfo)" />
  <UnknownCanvas v-else />
</template>
<script setup lang="ts">
import {
  type BlockColor,
  type LevelBoxInfo,
  type LevelFloorInfo,
  type LevelObjectInfo,
  type LevelRefInfo,
  type LevelWallInfo,
} from '@/models/level'
import WallCanvas from './WallCanvas.vue'
import RefCanvas from './RefCanvas.vue'
import BoxCanvas from './BoxCanvas.vue'
import FloorCanvas from './FloorCanvas.vue'
import UnknownCanvas from './UnknownCanvas.vue'

const props = defineProps<{ object?: LevelObjectInfo; parentColor?: BlockColor }>()
</script>
