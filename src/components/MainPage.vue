<template>
  <StartUpDialog></StartUpDialog>
  <div class="main-page h-screen w-screen min-w-240 overflow-hidden">
    <header class="main-header">
      <MainMenuBar />
    </header>
    <div class="main-body flex w-full flex-row gap-1">
      <aside class="flex max-h-full w-1/6 min-w-60 flex-none flex-col gap-1">
        <BlockListCard class="min-h-1/2 w-full flex-1" />
        <BlockInfoCard
          class="max-h-1/2 w-full flex-1"
          v-if="uiStore.focusedBlockId !== undefined"
        />
      </aside>
      <main class="flex h-full min-w-120 grow flex-col items-stretch overflow-auto">
        <BrushBar />
        <PaintBoard class="grow" />
      </main>
      <aside class="flex max-h-full w-1/6 min-w-60 flex-none flex-col gap-1">
        <InfoCard class="w-full flex-1" title="Cell Info">
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
            error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis,
            culpa ratione quam perferendis esse, cupiditate neque quas!
          </p>
        </InfoCard>
        <InfoCard class="w-full flex-1" title="Floor Info">
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
            error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis,
            culpa ratione quam perferendis esse, cupiditate neque quas!
          </p>
        </InfoCard>
      </aside>
    </div>
  </div>
</template>
<script setup lang="ts">
import StartUpDialog from './StartUpDialog.vue'
import MainMenuBar from './MainMenuBar.vue'
import InfoCard from './InfoCard.vue'
import BrushBar from './BrushBar.vue'
import BlockListCard from './BlockListCard.vue'
import PaintBoard from './PaintBoard.vue'
import BlockInfoCard from './BlockInfoCard.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>
