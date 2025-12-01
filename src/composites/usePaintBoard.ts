import { toObjsSortedByLayer, type BlockCell } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { last } from '@/service/utils'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'

export default function usePaintBoard() {
  const uiStore = useUiStore()
  const levelStore = useLevelStore()

  const applyBrush = (cell: Immutable<BlockCell>) => {
    const brush = uiStore.currentBrush
    const blockId = uiStore.focusedBlockId

    switch (brush.type) {
      case 'Erase':
        if (cell.layeredObjects.length === 0) return
        levelStore.deleteObject(last(cell.layeredObjects).objId)
        break
      case 'Wall':
      case 'Box':
      case 'Floor':
      case 'Ref':
        levelStore.upsertObject({
          ...brush,
          parentId: blockId,
          x: cell.x,
          y: cell.y,
        })
        console.log('draw', brush.type, brush)
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

  return { applyBrush }
}
