<template>
  <StartUpDialog></StartUpDialog>
  <div class="main-page h-screen w-screen overflow-hidden">
    <header class="main-header">
      <MainMenuBar />
    </header>
    <div class="main-body flex w-full flex-row gap-1">
      <aside class="flex max-h-full max-w-80 min-w-40 flex-none flex-col gap-1">
        <BlockListCard class="w-full flex-1" />
        <InfoCard class="w-full flex-1" title="Block Info">
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
            error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis,
            culpa ratione quam perferendis esse, cupiditate neque quas!
          </p>
        </InfoCard>
      </aside>
      <main class="h-full grow overflow-auto">
        <BrushBar />
        <p>{{ JSON.stringify(c) }}</p>
        <p>remark: HSB is actually HSV</p>
        <ColorPicker v-model="c" format="hsb" />
        <p></p>
        <Button @click="levelStore.clearLevel">Clear</Button>
        <Button @click="() => (uiStore.setUpDialogVisible = true)">Open</Button>
        <Button @click="openLevel.open">Faster Open</Button>
        <h1>Main</h1>
        <pre> {{ JSON.stringify(levelStore.levelHeader, undefined, 4) }} </pre>
        <pre> {{ JSON.stringify(levelStore.levelBlocks, undefined, 4) }} </pre>
      </main>
      <aside class="flex max-h-full max-w-80 min-w-40 flex-none flex-col gap-1">
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
import { useOpenLevel } from '@/composites'
import StartUpDialog from './StartUpDialog.vue'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'
import { Button, ColorPicker } from 'primevue'
import MainMenuBar from './MainMenuBar.vue'
import InfoCard from './InfoCard.vue'
import BrushBar from './BrushBar.vue'
import BlockListCard from './BlockListCard.vue'
import { ref } from 'vue'

const levelStore = useLevelStore()
const uiStore = useUiStore()
const openLevel = useOpenLevel()

const c = ref({ h: 20, s: 100, b: 100 })
</script>
