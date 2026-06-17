<template>
  <Menubar :model="items">
    <template #start>
      <LogoSvg class="size-10" />
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a class="flex items-center" v-bind="props.action">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
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
import { Menubar } from 'primevue'
import LogoSvg from '@/assets/logo.svg'
import { computed } from 'vue'
import type { MenuItem } from 'primevue/menuitem'
import { useEditorActions } from '@/composites'
import { useI18n } from 'vue-i18n'

const editorActions = useEditorActions()
const { t } = useI18n()

const items = computed<MenuItem[]>(() => [
  {
    label: t('menu.file.label'),
    icon: 'pi pi-file',
    items: [
      {
        label: t('menu.file.exportLevel'),
        icon: 'pi pi-file-export',
        command: editorActions.export.command,
        shortcut: editorActions.export.displayHotkey,
      },
      {
        label: t('menu.file.saveProject'),
        icon: 'pi pi-save',
        command: editorActions.save.command,
        shortcut: editorActions.save.displayHotkey,
      },
      {
        label: t('menu.file.new'),
        icon: 'pi pi-file-plus',
        command: editorActions.new.command,
        shortcut: editorActions.new.displayHotkey,
      },
      {
        label: t('menu.file.open'),
        icon: 'pi pi-folder-open',
        command: editorActions.open.command,
        shortcut: editorActions.open.displayHotkey,
      },
    ],
  },
  {
    label: t('menu.edit.label'),
    icon: 'pi pi-pen-to-square',
    items: [
      {
        label: t('menu.edit.undo'),
        icon: 'pi pi-undo',
        command: editorActions.undo.command,
        shortcut: editorActions.undo.displayHotkey,
      },
      {
        label: t('menu.edit.redo'),
        icon: 'pi pi-refresh',
        command: editorActions.redo.command,
        shortcut: editorActions.redo.displayHotkey,
      },
    ],
  },
  {
    label: t('menu.help.label'),
    icon: 'pi pi-question-circle',
    items: [
      {
        label: t('menu.help.customLevelGuide'),
        icon: 'pi pi-external-link',
        command: () => window.open('https://www.patricksparabox.com/custom-levels/', '_blank'),
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
