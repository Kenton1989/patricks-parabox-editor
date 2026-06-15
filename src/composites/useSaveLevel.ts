import { stringifyEditorSaveFile } from '@/service/editor-save'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'

function sanitizeFileName(name: string): string {
  return name
    .trim()
    .replace(/[<>:"/\\|?*]+/g, '-')
    .replace(/\s+/g, ' ')
}

function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  anchor.click()

  URL.revokeObjectURL(url)
}

export default function useSaveLevel() {
  const levelStore = useLevelStore()
  const uiStore = useUiStore()

  const save = () => {
    const levelText = stringifyEditorSaveFile({
      level: levelStore.exportEditorSaveData(),
      ui: uiStore.exportEditorSaveData(),
    })
    const baseName = sanitizeFileName(levelStore.levelHeader.name) || 'level'

    downloadTextFile(`${baseName}.ppeproj`, `${levelText}\n`)
  }

  return { save }
}
