<script setup lang="ts">
import {
  Avatar,
  Button,
  Dialog,
  FileUpload,
  Splitter,
  SplitterPanel,
  type FileUploadSelectEvent,
} from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { ref } from 'vue'

const visible = ref(true)

const confirm = useConfirm()

const notifyUploadError = (msg: string) => {
  confirm.require({
    message: msg,
    header: 'UploadError',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: {
      label: 'OK',
    },
  })
}

const onFileSelect = (e: FileUploadSelectEvent) => {
  console.log(e)

  const ele = e.originalEvent.target as HTMLInputElement
  console.log(ele.value)

  notifyUploadError('not support yet')
}
</script>
<template>
  <Dialog v-model:visible="visible" modal header="Start with ..." class="w-1/2" :closable="false">
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <Avatar image="/logo192.png" shape="square" />
        <span class="text-3xl font-bold"> Starts Patrick's Parabox level editor with... </span>
      </div>
    </template>
    <div>
      <Splitter>
        <SplitterPanel class="flex flex-col items-start gap-4 p-8">
          <p class="text-xl">Creating a new level</p>
          <Button label="Create" icon="pi pi-file-plus" />
        </SplitterPanel>
        <SplitterPanel class="flex flex-col gap-4 p-8">
          <p class="text-xl">Uploading a existing level</p>
          <FileUpload
            @select="onFileSelect"
            custom-upload
            auto
            accept="text/plain,application/json,.ppbox"
            mode="basic"
            :max-file-size="10240"
            choose-icon="pi pi-upload"
            choose-label="Upload"
            :show-cancel-button="false"
            :show-upload-button="false"
          >
          </FileUpload>
        </SplitterPanel>
      </Splitter>
    </div>
  </Dialog>
</template>
