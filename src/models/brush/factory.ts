import type { RefBrush } from './types'

export function createRefBrush(blockId: number): RefBrush {
  return {
    type: 'Ref',
    referToBlockId: blockId,
    exitBlock: true,
    infSetting: { type: 'noInf' },
    playerSetting: { type: 'notPlayer' },
    flipH: false,
    floatInSpace: false,
  }
}
