import type { BlockColor } from '../level'

export type SelectBrush = {
  type: 'select'
}

export type EraseBrush = {
  type: 'erase'
}

export type WallBrush = {
  type: 'wall'
}

export type BoxBrush = {
  type: 'box'
  color: BlockColor
  player: boolean
}

export type FloorBrush = {
  type: 'floor'
  playerFloor: boolean
}

export type RefBrush = {
  type: 'ref'
  blockId: number
}

export type Brush = SelectBrush | EraseBrush | WallBrush | BoxBrush | FloorBrush | RefBrush
