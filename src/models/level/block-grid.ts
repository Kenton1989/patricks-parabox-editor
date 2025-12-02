import type { Immutable } from '../utils'
import type { LevelObject } from './level-object'

export type BlockGrid = {
  blockId?: number
  cells: Immutable<BlockCell>[][]
  outliers: Immutable<LevelObject>[]
}

export type BlockCell = {
  x: number
  y: number
  layeredObjects: Immutable<LevelObject>[]
}
