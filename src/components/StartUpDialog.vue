<script setup lang="ts">
import { Avatar, Button, Dialog, Splitter, SplitterPanel } from 'primevue'
import logoUrl from '@/assets/logo192.png'
import { useOpenLevel } from '@/composites'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'

const levelStore = useLevelStore()
const uiStore = useUiStore()
const { t } = useI18n()

const openLevel = useOpenLevel()

const onCreateClick = () => {
  levelStore.initEmptyLevel()
  uiStore.setUpDialogVisible = false
}

const onUploadClick = () => {
  openLevel.open()
}

openLevel.onSuccess(() => {
  uiStore.setUpDialogVisible = false
})
</script>
<template>
  <Dialog
    v-model:visible="uiStore.setUpDialogVisible"
    modal
    :header="t('startup.header')"
    class="w-1/2 min-w-200"
    :closable="levelStore.isInitialized"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <Avatar :image="logoUrl" shape="square" />
        <span class="text-2xl font-bold">{{ t('startup.header') }}</span>
      </div>
    </template>
    <Splitter>
      <SplitterPanel class="flex flex-col gap-4 p-8">
        <p class="text-xl">{{ t('startup.createDescription') }}</p>
        <Button :label="t('startup.createAction')" icon="pi pi-file-plus" @click="onCreateClick" />
      </SplitterPanel>
      <SplitterPanel class="flex flex-col gap-4 p-8">
        <p class="text-xl">{{ t('startup.uploadDescription') }}</p>
        <Button :label="t('startup.uploadAction')" icon="pi pi-upload" @click="onUploadClick" />
      </SplitterPanel>
    </Splitter>
  </Dialog>
</template>
