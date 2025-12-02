<script setup lang="ts">
import { ConfirmDialog } from 'primevue'
import ErrorBoundary from './components/templates/ErrorBoundary.vue'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
</script>

<template>
  <ErrorBoundary>
    <DndProvider :backend="HTML5Backend">
      <router-view></router-view>
      <ConfirmDialog />
    </DndProvider>
  </ErrorBoundary>
</template>
