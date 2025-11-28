import { useLevelStore } from '@/stores/level'
import useOpenLevel from './useOpenLevel'
import { useUiStore } from '@/stores/ui'

const platform = window.navigator.platform
const isMac = platform.startsWith('Mac') || platform === 'iPhone'

function ctrl(key: string) {
  return isMac ? `cmd+${key}` : `ctrl+${key}`
}

function displayCtrl(key: string) {
  return isMac ? `⌘+${key}` : `Ctrl+${key}`
}

export type EditorAction = {
  name: string
  hotkey: string
  displayHotkey: string
  command: () => unknown
}

export default function useEditorActions() {
  const uiStore = useUiStore()
  const levelStore = useLevelStore()
  const openLevel = useOpenLevel()

  const actions = {
    open: {
      name: 'open',
      hotkey: ctrl('O'),
      displayHotkey: displayCtrl('O'),
      command: openLevel.open,
    },
    export: {
      name: 'export',
      hotkey: ctrl('E'),
      displayHotkey: displayCtrl('E'),
      command: () => alert('not support export yet'),
    },
    save: {
      name: 'save',
      hotkey: ctrl('S'),
      displayHotkey: displayCtrl('S'),
      command: () => alert('not support save yet'),
    },
    new: {
      name: 'new',
      hotkey: ctrl('N'),
      displayHotkey: displayCtrl('N'),
      command: () => (uiStore.setUpDialogVisible = true),
    },
    undo: {
      name: 'undo',
      hotkey: ctrl('Z'),
      displayHotkey: displayCtrl('Z'),
      command: levelStore.undo,
    },
    redo: {
      name: 'redo',
      hotkey: ctrl('Shift+Z'),
      displayHotkey: displayCtrl('Shift+Z'),
      command: levelStore.redo,
    },
  }

  return actions as { [key in keyof typeof actions]: EditorAction }
}
