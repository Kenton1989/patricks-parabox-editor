<template>
  <div class="block-list-item flex min-h-20 justify-start align-middle">
    {{ props.block.name }}
  </div>
</template>
<script setup lang="ts">
import type { LevelBlock } from '@/models/level'

const props = defineProps<{
  block: LevelBlock
}>()
</script>
