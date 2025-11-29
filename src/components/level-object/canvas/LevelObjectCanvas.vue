<template>
  <WallCanvas
    v-if="props.object?.type === 'Wall'"
    :object="cast.wall(object)"
    :parentColor="parentColor"
  />
  <RefCanvas v-else-if="props.object?.type === 'Ref'" :object="cast.ref(object)" />
  <BoxCanvas v-else-if="props.object?.type === 'Box'" :object="cast.box(object)" />
  <FloorCanvas v-else-if="props.object?.type === 'Floor'" :object="cast.floor(object)" />
  <UnknownCanvas v-else />
</template>
<script setup lang="ts">
import { cast, type BlockColor, type LevelObject } from '@/models/level'
import WallCanvas from './WallCanvas.vue'
import RefCanvas from './RefCanvas.vue'
import BoxCanvas from './BoxCanvas.vue'
import FloorCanvas from './FloorCanvas.vue'
import UnknownCanvas from './UnknownCanvas.vue'

const props = defineProps<{ object?: LevelObject; parentColor?: BlockColor }>()
</script>
