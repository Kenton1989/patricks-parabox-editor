import { describe, expect, it } from 'vitest'

import {
  EDITOR_SAVE_FILE_TYPE,
  EDITOR_SAVE_FILE_VERSION,
  EditorSaveFileError,
  parseEditorSaveFile,
  stringifyEditorSaveFile,
  type EditorSaveData,
} from '@/service/editor-save'
import { createDefaultLevelHeader } from '@/models/level'

const SAVE_DATA: EditorSaveData = {
  level: {
    header: createDefaultLevelHeader(),
    blocks: [
      {
        blockId: 0,
        name: 'Root',
        width: 5,
        height: 5,
        color: 'root',
        zoomFactor: 1,
        children: [],
      },
    ],
  },
  ui: {
    focusedBlockId: 0,
  },
}

describe('editor save file', () => {
  it('serializes and parses the editor state envelope', () => {
    const rawSaveFile = stringifyEditorSaveFile(SAVE_DATA)

    expect(parseEditorSaveFile(rawSaveFile)).toStrictEqual({
      type: EDITOR_SAVE_FILE_TYPE,
      version: EDITOR_SAVE_FILE_VERSION,
      data: SAVE_DATA,
    })
  })

  it('rejects non-json editor save files', () => {
    expect(() => parseEditorSaveFile('version 4\n#')).toThrow(EditorSaveFileError)
  })

  it('rejects json files that are not editor saves', () => {
    expect(() => parseEditorSaveFile(JSON.stringify({ type: 'Root' }))).toThrow(
      EditorSaveFileError,
    )
  })
})
