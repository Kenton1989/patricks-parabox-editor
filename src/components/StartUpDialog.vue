<script setup lang="ts">
import { Avatar, Button, ConfirmDialog, Dialog, Splitter, SplitterPanel } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import logoUrl from '@/assets/logo192.png'
import { useOpenLevel } from '@/composites'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'

const levelStore = useLevelStore()
const uiStore = useUiStore()

const confirm = useConfirm()
const openLevel = useOpenLevel()

const notifyUploadError = (message: string) => {
  confirm.require({
    message,
    header: 'Upload File Error',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: {
      label: 'OK',
    },
    rejectProps: {
      style: 'display: none',
    },
  })
}

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

openLevel.onError((e) => {
  notifyUploadError(`${e}`)
})
</script>
<template>
  <Dialog
    v-model:visible="uiStore.setUpDialogVisible"
    modal
    header="Start with ..."
    class="w-1/2 min-w-200"
    :closable="levelStore.isInitialized"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <Avatar :image="logoUrl" shape="square" />
        <span class="text-2xl font-bold"> Starts Patrick's Parabox level editor with... </span>
      </div>
    </template>
    <ConfirmDialog></ConfirmDialog>
    <Splitter>
      <SplitterPanel class="flex flex-col gap-4 p-8">
        <p class="text-xl">Creating a new level</p>
        <Button label="Create" icon="pi pi-file-plus" @click="onCreateClick" />
      </SplitterPanel>
      <SplitterPanel class="flex flex-col gap-4 p-8">
        <p class="text-xl">Uploading a existing level</p>
        <Button label="Upload" icon="pi pi-upload" @click="onUploadClick" />
      </SplitterPanel>
    </Splitter>
  </Dialog>
</template>
