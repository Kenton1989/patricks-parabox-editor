<template>
  <InfoCard title="Block List" bodyNoPadding>
    <BlockListItem v-for="block in levelStore.levelBlocks" :key="block.blockId" :block="block" />
  </InfoCard>
</template>
<script lang="ts" setup>
import { useLevelStore } from '@/stores/level'
import InfoCard from './InfoCard.vue'
import BlockListItem from './BlockListItem.vue'

const levelStore = useLevelStore()
</script>
