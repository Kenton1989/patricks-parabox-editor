<template>
  <h1>Main</h1>

  <StartUpDialog v-if="isStartUpVisible"></StartUpDialog>
  <Button @click="notifyUploadError">Aba </Button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import StartUpDialog from './StartUpDialog.vue'
import { Button, useConfirm } from 'primevue'

const confirm = useConfirm()

const isStartUpVisible = computed(() => true)

const notifyUploadError = () => {
  confirm.require({
    message: 'some error',
    header: 'UploadError',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: {
      label: 'OK',
    },
  })
}
</script>
