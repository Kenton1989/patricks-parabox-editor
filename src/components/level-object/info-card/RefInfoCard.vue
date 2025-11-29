<template>
  <InfoCard title="Ref Info">
    <pre>{{ JSON.stringify(props.object, null, 4) }}</pre>
  </InfoCard>
</template>
<script setup lang="ts">
import type { LevelRef } from '@/models/level'
import InfoCard from '@/components/InfoCard.vue'

const props = defineProps<{ object: LevelRef }>()
</script>
