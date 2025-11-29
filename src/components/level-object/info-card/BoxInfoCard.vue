<template>
  <InfoCard title="Box Info">
    <pre>{{ JSON.stringify(props.object, null, 4) }}</pre>
  </InfoCard>
</template>
<script setup lang="ts">
import type { LevelBox } from '@/models/level'
import InfoCard from '@/components/InfoCard.vue'

const props = defineProps<{ object?: LevelBox }>()
</script>
