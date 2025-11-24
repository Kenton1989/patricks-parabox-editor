<template>
  <Button @click="levelStore.clearLevel">Clear</Button>
  <Button @click="() => (uiStore.setUpDialogVisible = true)">Open</Button>
  <Button @click="openLevel.open">Faster Open</Button>
  <h1>Main</h1>
  <pre> {{ JSON.stringify(levelStore.levelHeader, undefined, 4) }} </pre>
  <pre> {{ JSON.stringify(levelStore.levelBlocks, undefined, 4) }} </pre>
  <StartUpDialog></StartUpDialog>
</template>
<script setup lang="ts">
import { useOpenLevel } from '@/composites'
import StartUpDialog from './StartUpDialog.vue'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'
import { Button } from 'primevue'

const levelStore = useLevelStore()
const uiStore = useUiStore()
const openLevel = useOpenLevel()
</script>
