<template>
  <Menubar :model="items">
    <template #start>
      <img :src="logoUrl" class="size-10" alt="pp logo" />
    </template>
    <template #end>
      <div class="flex h-full flex-row content-center items-start gap-4">
        <a
          v-for="ext in externalLinks"
          :key="ext.url"
          :href="ext.url"
          target="_blank"
          class="block size-5"
        >
          <img :src="ext.iconUrl" alt="external logo" />
        </a>
      </div>
    </template>
  </Menubar>
</template>
<script setup lang="ts">
import logoUrl from '@/assets/logo192.png'
import { Menubar } from 'primevue'

import { ref } from 'vue'

const items = ref([
  {
    label: 'File',
    icon: 'pi pi-file',
    items: [
      {
        label: 'Export playable level',
        icon: 'pi pi-file-export',
      },
      {
        label: 'Save .ppbox',
        icon: 'pi pi-save',
      },
      {
        label: 'New',
        icon: 'pi pi-file-plus',
      },
      {
        label: 'Open',
        icon: 'pi pi-folder-open',
      },
    ],
  },
  {
    label: 'Edit',
    icon: 'pi pi-pen-to-square',
    items: [
      {
        label: 'Undo',
        icon: 'pi pi-undo',
      },
      {
        label: 'Redo',
        icon: 'pi pi-refresh',
      },
    ],
  },
])

const externalLinks = [
  {
    url: 'https://www.patricksparabox.com/',
    iconUrl: 'https://www.patricksparabox.com/images/favicon.ico',
  },
  {
    url: 'https://github.com/Kenton1989/patricks-parabox-editor',
    iconUrl: 'https://github.com/fluidicon.png',
  },
]
</script>
