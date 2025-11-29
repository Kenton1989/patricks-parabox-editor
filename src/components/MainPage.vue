<template>
  <StartUpDialog></StartUpDialog>
  <div class="main-page h-screen w-screen min-w-240 overflow-hidden">
    <header class="main-header">
      <MainMenuBar />
    </header>
    <div class="main-body flex w-full flex-row gap-1">
      <aside class="flex max-h-full w-1/6 min-w-75 flex-none flex-col gap-1">
        <BlockListCard class="min-h-1/2 w-full flex-1" />
        <FocusedBlockInfoCard class="max-h-1/2 w-full flex-1" v-if="focusedBlock" />
      </aside>
      <main class="flex h-full min-w-120 grow flex-col items-stretch overflow-auto">
        <BrushBar />
        <PaintBoard class="grow" />
      </main>
      <aside class="flex max-h-full w-1/6 min-w-75 flex-none flex-col gap-1">
        <FocusedCellInfoSideBar class="h-full w-full" />
      </aside>
    </div>
  </div>
</template>
<script setup lang="ts">
import StartUpDialog from './StartUpDialog.vue'
import MainMenuBar from './MainMenuBar.vue'
import BrushBar from './BrushBar.vue'
import BlockListCard from './BlockListCard.vue'
import PaintBoard from './PaintBoard.vue'
import FocusedBlockInfoCard from './FocusedBlockInfoCard.vue'
import { useGlobalHotkeys, useFocusedBlock } from '@/composites'
import FocusedCellInfoSideBar from './FocusedCellInfoSideBar.vue'

const focusedBlock = useFocusedBlock()

useGlobalHotkeys()
</script>
