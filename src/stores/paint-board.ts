import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useLevelStore } from './level'
import type { Immutable } from '@/models/utils'
import { toObjsSortedByLayer, type BlockCell } from '@/models/level'
import { useUiStore } from './ui'
import { last } from '@/service/utils'
import { watchImmediate } from '@vueuse/core'
import { useFocusedBlock } from '@/composites'

export const usePaintBoard = defineStore('paint-board', () => {
  const uiStore = useUiStore()
  const levelStore = useLevelStore()
  const { grid } = useFocusedBlock()

  const _isDrawing = ref(false)

  const startDrawing = (e?: MouseEvent) => {
    if (e) uiStore.handleMousePressed(e)
    _isDrawing.value = true
  }

  watchImmediate(
    () => ({ isDrawing: _isDrawing.value, cursor: uiStore.cursor }),
    ({ isDrawing, cursor }) => {
      if (!isDrawing) {
        return
      }

      if (needToEndDrawing(isDrawing, cursor.isPressed)) {
        _isDrawing.value = false
        levelStore.commitEditHistory()
        return
      }

      if (!cursor.inGrid) {
        return
      }

      if (grid.value.cells.length <= cursor.x || grid.value.cells[cursor.x]!.length <= cursor.y) {
        return
      }

      const currentCell = grid.value.cells[cursor.x]![cursor.y]!
      applyBrush(currentCell, true)
    },
  )

  const applyBrush = (cell: Immutable<BlockCell>, disableCommit?: boolean) => {
    const brush = uiStore.currentBrush
    const blockId = uiStore.focusedBlockId

    switch (brush.type) {
      case 'Erase':
        if (cell.layeredObjects.length === 0) return
        levelStore.deleteObject(last(cell.layeredObjects).objId, disableCommit)
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

    const latestObjects = levelStore.getObjectsByCell(blockId, cell.x, cell.y)
    if (latestObjects.length > 0) {
      uiStore.focusedCell = {
        x: cell.x,
        y: cell.y,
        layeredObjects: toObjsSortedByLayer(latestObjects),
      }
    } else {
      uiStore.focusedCell = undefined
    }
  }

  return {
    _isDrawing,

    isDrawing: computed(() => _isDrawing.value),

    startDrawing,
    applyBrush,
  }
})

function needToEndDrawing(isDrawing: boolean, isPressed: boolean): boolean {
  return isDrawing && !isPressed
}
