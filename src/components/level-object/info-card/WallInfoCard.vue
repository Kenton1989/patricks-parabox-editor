<template>
  <InfoCard title="Wall Info">
    <pre>{{ JSON.stringify(props.object, null, 4) }}</pre>
  </InfoCard>
</template>
<script setup lang="ts">
import type { LevelWall } from '@/models/level'
import { InfoCard } from '@/components/templates'

const props = defineProps<{ object: LevelWall }>()
</script>
