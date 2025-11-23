<script setup lang="ts">
import { Avatar, Button, ConfirmDialog, Dialog, Splitter, SplitterPanel } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { computed, ref, watch } from 'vue'
import logoUrl from '@/assets/logo192.png'
import { useOpenLevelDialog } from '@/composites'
import { LevelParser as LevelParserV4 } from '@/service/game-level/v4'
import { readFileAsText } from '@/service/file'
import { useLevelStore } from '@/stores/level'

const confirm = useConfirm()

const levelStore = useLevelStore()

const visible = ref(!levelStore.isInitialized)
watch([visible, levelStore], ([newVisible, { isInitialized }]) => {
  if (!isInitialized && !newVisible) visible.value = true
})

const isClosable = computed(() => levelStore.isInitialized)

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

  try {
    const levelData = await readFileAsText(file)
    const rawLevel = LevelParserV4.parse(levelData)
    levelStore.initLevelV4(rawLevel)
    levelStore.resetStack()
    visible.value = false
  } catch (e: unknown) {
    notifyUploadError(`${e}`)
  }
})

watch(levelStore, (newVal) => {
  console.log(newVal)
})
</script>
<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Start with ..."
    class="w-1/2"
    :closable="isClosable"
  >
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
