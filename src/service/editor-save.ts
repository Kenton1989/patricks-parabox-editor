import type { LevelBlock, LevelHeader } from '@/models/level'

export const EDITOR_SAVE_FILE_TYPE = 'patricks-parabox-editor-save'
export const EDITOR_SAVE_FILE_VERSION = 1

export type EditorSaveData = {
  level: {
    header: LevelHeader
    blocks: LevelBlock[]
  }
  ui: {
    focusedBlockId: number
  }
}

export type EditorSaveFile = {
  type: typeof EDITOR_SAVE_FILE_TYPE
  version: typeof EDITOR_SAVE_FILE_VERSION
  data: EditorSaveData
}

export class EditorSaveFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EditorSaveFileError'
  }
}

export function createEditorSaveFile(data: EditorSaveData): EditorSaveFile {
  return {
    type: EDITOR_SAVE_FILE_TYPE,
    version: EDITOR_SAVE_FILE_VERSION,
    data,
  }
}

export function stringifyEditorSaveFile(data: EditorSaveData): string {
  return JSON.stringify(createEditorSaveFile(data), null, 2)
}

export function parseEditorSaveFile(rawFile: string): EditorSaveFile {
  let parsed: unknown

  try {
    parsed = JSON.parse(rawFile)
  } catch {
    throw new EditorSaveFileError('Invalid .ppeproj file: expected JSON editor save data')
  }

  if (!isRecord(parsed)) {
    throw new EditorSaveFileError('Invalid .ppeproj file: expected an editor save object')
  }

  if (parsed.type !== EDITOR_SAVE_FILE_TYPE) {
    throw new EditorSaveFileError('Invalid .ppeproj file: unknown save file type')
  }

  if (parsed.version !== EDITOR_SAVE_FILE_VERSION) {
    throw new EditorSaveFileError(`Unsupported .ppeproj save version: ${parsed.version}`)
  }

  if (!isEditorSaveData(parsed.data)) {
    throw new EditorSaveFileError('Invalid .ppeproj file: malformed editor save data')
  }

  return parsed as EditorSaveFile
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isEditorSaveData(value: unknown): value is EditorSaveData {
  if (!isRecord(value)) return false
  if (!isRecord(value.level)) return false
  if (!isRecord(value.level.header)) return false
  if (!Array.isArray(value.level.blocks)) return false
  if (!isRecord(value.ui)) return false
  if (typeof value.ui.focusedBlockId !== 'number') return false
  return true
}
