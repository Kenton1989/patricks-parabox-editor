<template>
  <div class="flex flex-row-reverse gap-1 py-1">
    <Badge :value="`x,y: (${props.object.x},${props.object.y})`" severity="secondary" />
    <Badge :value="`ID: ${props.object.objId}`" severity="secondary" />
  </div>
</template>
<script setup lang="ts">
import type { LevelObject } from '@/models/level'
import { Badge } from 'primevue'

const props = defineProps<{ object: LevelObject }>()
</script>
