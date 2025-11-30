import { NOT_PLAYER, type BlockCell } from '@/models/level'
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
      case 'select':
        uiStore.focusedCell = cell
        return
      case 'erase':
        if (cell.layeredObjects.length === 0) return
        levelStore.deleteObject(last(cell.layeredObjects).objId)
        return
      case 'wall':
        levelStore.upsertObject({
          type: 'Wall',
          parentId: blockId,
          playerSetting: { ...NOT_PLAYER },
          x: cell.x,
          y: cell.y,
        })
        break
      case 'box':
        levelStore.upsertObject({
          type: 'Box',
          parentId: blockId,
          playerSetting: brush.player ? { type: 'player', playerOrder: 0 } : { ...NOT_PLAYER },
          color: brush.color!,
          x: cell.x,
          y: cell.y,
        })
        break
      case 'floor':
        break
      case 'ref':
        break
    }
  }

  return { applyBrush }
}
