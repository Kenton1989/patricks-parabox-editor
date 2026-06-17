import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useLevelStore } from './level'
import type { Immutable } from '@/models/utils'
import { type BlockCell } from '@/models/level'
import { useUiStore } from './ui'
import { last } from '@/service/utils'
import { watchImmediate } from '@vueuse/core'
import { useFocusedBlock } from '@/composites'

export type EditAction = 'none' | 'brush' | 'drag' | 'erase'

export const usePaintBoard = defineStore('paint-board', () => {
  const uiStore = useUiStore()
  const levelStore = useLevelStore()
  const { grid } = useFocusedBlock()

  const editAction = ref<EditAction>('none')

  const tryStartEditAction = (action: Exclude<EditAction, 'none'>): boolean => {
    if (editAction.value !== 'none') return false
    editAction.value = action
    return true
  }

  const endEditAction = (action: EditAction, disableCommit = false): boolean => {
    if (editAction.value !== action) return false
    editAction.value = 'none'
    if (!disableCommit) levelStore.commitEditHistory()
    return true
  }

  const startDrawing = (e?: MouseEvent): boolean => {
    if (e) uiStore.handleMousePressed(e)
    return tryStartEditAction('brush')
  }

  const startErasing = (e?: MouseEvent): boolean => {
    if (e) uiStore.handleMousePressed(e)
    return tryStartEditAction('erase')
  }

  watchImmediate(
    () => ({ editAction: editAction.value, cursor: uiStore.cursor }),
    ({ editAction, cursor }) => {
      if (editAction === 'none' || editAction === 'drag') {
        return
      }

      if (needToEndEditAction(editAction, cursor.leftPressed, cursor.rightPressed)) {
        endEditAction(editAction)
        return
      }

      if (!cursor.inGrid) {
        return
      }

      if (grid.value.cells.length <= cursor.x || grid.value.cells[cursor.x]!.length <= cursor.y) {
        return
      }

      const currentCell = grid.value.cells[cursor.x]![cursor.y]!

      switch (editAction) {
        case 'brush':
          applyBrush(currentCell, true)
          break
        case 'erase':
          applyErase(currentCell, true)
          break
      }
    },
  )

  const applyBrush = (cell: Immutable<BlockCell>, disableCommit?: boolean) => {
    const brush = uiStore.currentBrush
    const blockId = uiStore.focusedBlockId

    switch (brush.type) {
      case 'Erase':
        if (!applyErase(cell, disableCommit)) return
        break
      case 'Wall':
      case 'Box':
      case 'Floor':
      case 'Ref':
        levelStore.upsertObject(
          {
            ...JSON.parse(JSON.stringify(brush)),
            parentId: blockId,
            x: cell.x,
            y: cell.y,
          },
          disableCommit,
        )
        break
      default:
        break
    }

    uiStore.focusCell(cell.x, cell.y)
  }

  const applyErase = (cell: Immutable<BlockCell>, disableCommit?: boolean): boolean => {
    if (cell.layeredObjects.length === 0) return false
    levelStore.deleteObject(last(cell.layeredObjects).objId, disableCommit)
    uiStore.focusCell(cell.x, cell.y)
    return true
  }

  return {
    isEditing: computed(() => editAction.value !== 'none'),
    isDragging: computed(() => editAction.value === 'drag'),

    applyBrush,
    applyErase,

    tryStartEditAction,
    startDrawing,
    startErasing,
    endEditAction,
  }
})

function needToEndEditAction(
  editAction: EditAction,
  leftPressed: boolean,
  rightPressed: boolean,
): boolean {
  switch (editAction) {
    case 'brush':
      return !leftPressed
    case 'erase':
      return !rightPressed
    default:
      return false
  }
}
