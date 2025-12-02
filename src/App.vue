<script setup lang="ts">
import { ConfirmDialog } from 'primevue'
import ErrorBoundary from './components/templates/ErrorBoundary.vue'
</script>

<template>
  <ErrorBoundary>
    <router-view></router-view>
    <ConfirmDialog />
  </ErrorBoundary>
</template>
