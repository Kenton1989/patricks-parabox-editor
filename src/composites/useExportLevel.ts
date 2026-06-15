import { v4 } from '@/service/convertors'
import { LevelSerializer } from '@/service/game-level/v4'
import { useLevelStore } from '@/stores/level'

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

export default function useExportLevel() {
  const levelStore = useLevelStore()

  const exportLevel = () => {
    const rawLevel = v4.fromLevel(levelStore.levelHeader, levelStore.levelBlocks)
    const levelText = LevelSerializer.serialize(rawLevel)
    const baseName = sanitizeFileName(levelStore.levelHeader.name) || 'level'

    downloadTextFile(`${baseName}.txt`, `${levelText}\n`)
  }

  return { export: exportLevel }
}
