<template>
  <InfoCard title="Floor Info">
    <pre>{{ JSON.stringify(props.object, null, 4) }}</pre>
  </InfoCard>
</template>
<script setup lang="ts">
import type { LevelFloor } from '@/models/level'
import { InfoCard } from '@/components/templates'

const props = defineProps<{ object: LevelFloor }>()
</script>
