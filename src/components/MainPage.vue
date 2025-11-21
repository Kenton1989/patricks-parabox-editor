<template>
  <h1>Main</h1>
  <StartUpDialog v-if="isStartUpVisible"></StartUpDialog>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import StartUpDialog from './StartUpDialog.vue'

const isStartUpVisible = computed(() => true)
</script>
