<script setup lang="ts">
import { Avatar, Button, ConfirmDialog, Dialog, Splitter, SplitterPanel } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { ref } from 'vue'
import logoUrl from '@/assets/logo192.png'
import { useOpenLevelDialog } from '@/composites'
import { LevelParser } from '@/service/game-level/v4'
import { readFileAsText } from '@/service/file'

const visible = ref(true)

const confirm = useConfirm()

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

const openLevelDialog = useOpenLevelDialog()

const onUploadClick = () => {
  openLevelDialog.open()
}

openLevelDialog.onChange(async (file) => {
  if (!file) return

  const levelData = await readFileAsText(file)

  try {
    console.log(LevelParser.parse(levelData))
  } catch (e: unknown) {
    notifyUploadError(`${e}`)
  }
})
</script>
<template>
  <Dialog v-model:visible="visible" modal header="Start with ..." class="w-1/2" :closable="false">
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <Avatar :image="logoUrl" shape="square" />
        <span class="text-3xl font-bold"> Starts Patrick's Parabox level editor with... </span>
      </div>
    </template>
    <ConfirmDialog></ConfirmDialog>
    <Splitter>
      <SplitterPanel class="flex flex-col gap-4 p-8">
        <p class="text-xl">Creating a new level</p>
        <Button label="Create" icon="pi pi-file-plus" />
      </SplitterPanel>
      <SplitterPanel class="flex flex-col gap-4 p-8">
        <p class="text-xl">Uploading a existing level</p>
        <Button label="Upload" icon="pi pi-upload" @click="onUploadClick" />
      </SplitterPanel>
    </Splitter>
  </Dialog>
</template>
