<template>
  <h1>Main</h1>
  <pre> {{ JSON.stringify(levelStore.levelHeader, undefined, 4) }} </pre>
  <pre> {{ JSON.stringify(levelStore.levelBlocks, undefined, 4) }} </pre>
  <StartUpDialog v-if="isStartUpVisible"></StartUpDialog>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import StartUpDialog from './StartUpDialog.vue'
import { useLevelStore } from '@/stores/level'

const isStartUpVisible = computed(() => true)
const levelStore = useLevelStore()
</script>
