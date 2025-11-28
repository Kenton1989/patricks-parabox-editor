import { useLevelStore } from '@/stores/level'
import useOpenLevel from './useOpenLevel'
import { useUiStore } from '@/stores/ui'

const platform = window.navigator.platform
const isMac = platform.startsWith('Mac') || platform === 'iPhone'

function keyPressed(e: KeyboardEvent, key: string) {
  return key.localeCompare(e.key, undefined, { sensitivity: 'base' }) === 0
}

function ctrl(key: string) {
  return isMac
    ? (e: KeyboardEvent) => e.metaKey && keyPressed(e, key)
    : (e: KeyboardEvent) => e.ctrlKey && keyPressed(e, key)
}

function ctrlShift(key: string) {
  return isMac
    ? (e: KeyboardEvent) => e.metaKey && e.shiftKey && keyPressed(e, key)
    : (e: KeyboardEvent) => e.ctrlKey && e.shiftKey && keyPressed(e, key)
}

function displayCtrl(key: string) {
  return isMac ? `⌘+${key}` : `Ctrl+${key}`
}

export type EditorAction = {
  name: string
  displayHotkey: string
  command: () => unknown
  hotkeyPressed: (e: KeyboardEvent) => boolean
}

export default function useEditorActions() {
  const uiStore = useUiStore()
  const levelStore = useLevelStore()
  const openLevel = useOpenLevel()

  const actions = {
    open: {
      name: 'open',
      hotkeyPressed: ctrl('O'),
      displayHotkey: displayCtrl('O'),
      command: openLevel.open,
    },
    export: {
      name: 'export',
      hotkeyPressed: ctrl('E'),
      displayHotkey: displayCtrl('E'),
      command: () => alert('not support export yet'),
    },
    save: {
      name: 'save',
      hotkeyPressed: ctrl('S'),
      displayHotkey: displayCtrl('S'),
      command: () => alert('not support save yet'),
    },
    new: {
      name: 'new',
      hotkeyPressed: ctrl('N'),
      displayHotkey: displayCtrl('N'),
      command: () => (uiStore.setUpDialogVisible = true),
    },
    undo: {
      name: 'undo',
      hotkeyPressed: ctrl('Z'),
      displayHotkey: displayCtrl('Z'),
      command: levelStore.undo,
    },
    redo: {
      name: 'redo',
      hotkeyPressed: ctrlShift('Z'),
      displayHotkey: displayCtrl('Shift+Z'),
      command: levelStore.redo,
    },
  }

  return actions as { [key in keyof typeof actions]: EditorAction }
}
