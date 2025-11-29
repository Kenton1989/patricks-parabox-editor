<template>
  <Menubar :model="items">
    <template #start>
      <LogoSvg class="size-10" />
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a class="flex items-center" v-bind="props.action">
        <span>{{ item.label }}</span>
        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="border-surface bg-emphasis text-muted-color ml-auto rounded border p-1 text-xs"
          >{{ item.shortcut }}</span
        >
        <i
          v-if="hasSubmenu"
          :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"
        ></i>
      </a>
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
import { Badge, Menubar } from 'primevue'
import LogoSvg from '@/assets/logo.svg'

import { computed } from 'vue'
import type { MenuItem } from 'primevue/menuitem'
import { useEditorActions } from '@/composites'

const editorActions = useEditorActions()

const items = computed<MenuItem[]>(() => [
  {
    label: 'File',
    icon: 'pi pi-file',
    items: [
      {
        label: 'Export level',
        icon: 'pi pi-file-export',
        command: editorActions.export.command,
        shortcut: editorActions.export.displayHotkey,
      },
      {
        label: 'Save .ppbox',
        icon: 'pi pi-save',
        command: editorActions.save.command,
        shortcut: editorActions.save.displayHotkey,
      },
      {
        label: 'New',
        icon: 'pi pi-file-plus',
        command: editorActions.new.command,
        shortcut: editorActions.new.displayHotkey,
      },
      {
        label: 'Open',
        icon: 'pi pi-folder-open',
        command: editorActions.open.command,
        shortcut: editorActions.open.displayHotkey,
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
        command: editorActions.undo.command,
        shortcut: editorActions.undo.displayHotkey,
      },
      {
        label: 'Redo',
        icon: 'pi pi-refresh',
        command: editorActions.redo.command,
        shortcut: editorActions.redo.displayHotkey,
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
