<template>
  <StartUpDialog></StartUpDialog>
  <div class="main-page h-screen w-screen overflow-hidden">
    <header class="main-header">
      <MainMenuBar />
    </header>
    <div class="main-body flex w-full flex-row">
      <aside class="flex max-h-full max-w-80 min-w-40 flex-none flex-col gap-1">
        <InfoCard class="w-full flex-1" sectionTitle="Block List">
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
            error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis,
            culpa ratione quam perferendis esse, cupiditate neque quas!
          </p>
        </InfoCard>
        <InfoCard class="w-full flex-1" sectionTitle="Block Info">
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
            error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis,
            culpa ratione quam perferendis esse, cupiditate neque quas!
          </p>
        </InfoCard>
      </aside>
      <main class="h-full grow overflow-auto">
        <Button @click="levelStore.clearLevel">Clear</Button>
        <Button @click="() => (uiStore.setUpDialogVisible = true)">Open</Button>
        <Button @click="openLevel.open">Faster Open</Button>
        <h1>Main</h1>
        <pre> {{ JSON.stringify(levelStore.levelHeader, undefined, 4) }} </pre>
        <pre> {{ JSON.stringify(levelStore.levelBlocks, undefined, 4) }} </pre>
      </main>
      <aside class="flex max-h-full max-w-80 min-w-40 flex-none flex-col gap-1">
        <InfoCard class="w-full flex-1" sectionTitle="Cell Info">
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
            error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis,
            culpa ratione quam perferendis esse, cupiditate neque quas!
          </p>
        </InfoCard>
        <InfoCard class="w-full flex-1" sectionTitle="Floor Info">
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
import { useOpenLevel } from '@/composites'
import StartUpDialog from './StartUpDialog.vue'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'
import { Button } from 'primevue'
import MainMenuBar from './MainMenuBar.vue'
import InfoCard from './InfoCard.vue'

const levelStore = useLevelStore()
const uiStore = useUiStore()
const openLevel = useOpenLevel()
</script>
