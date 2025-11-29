import type { LevelObject } from './level-object'

export type BlockGrid = {
  blockId: number
  cells: BlockCell[][]
  outliers: LevelObject[]
}

export type BlockCell = {
  x: number
  y: number
  objects: LevelObject[]
}
