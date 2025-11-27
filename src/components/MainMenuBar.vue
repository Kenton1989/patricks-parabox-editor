<template>
  <Menubar :model="items">
    <template #start>
      <LogoSvg class="size-10" />
    </template>
    <template #end>
      <div class="flex h-full flex-row content-center items-start gap-4">
        <a
          v-for="ext in externalLinks"
          :key="ext.url"
          :href="ext.url"
          target="_blank"
          class="block size-5 overflow-hidden"
          :class="{
            'rounded-full': ext.circleIcon,
            'rounded-xs': !ext.circleIcon,
          }"
        >
          <img :src="ext.iconUrl" alt="external logo" />
        </a>
      </div>
    </template>
  </Menubar>
</template>
<script setup lang="ts">
import { Menubar } from 'primevue'
import LogoSvg from '@/assets/logo.svg'

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
    circleIcon: false,
  },
  {
    url: 'https://store.steampowered.com/app/1260520/Patricks_Parabox/',
    iconUrl: 'https://store.steampowered.com/favicon.ico',
    circle: true,
  },
  {
    url: 'https://github.com/Kenton1989/patricks-parabox-editor',
    iconUrl: 'https://github.com/fluidicon.png',
    circle: true,
  },
]
</script>
