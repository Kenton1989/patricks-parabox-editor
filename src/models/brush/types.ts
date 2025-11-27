import type { BlockColor } from '../level'

export type SelectBrush = {
  type: 'select'
  color?: undefined
}

export type EraseBrush = {
  type: 'erase'
  color?: undefined
}

export type WallBrush = {
  type: 'wall'
  color?: undefined
}

export type BoxBrush = {
  type: 'box'
  color: BlockColor
  player: boolean
}

export type FloorBrush = {
  type: 'floor'
  color?: undefined
  playerFloor: boolean
}

export type RefBrush = {
  type: 'ref'
  color?: undefined
  blockId: number
}

export type Brush = SelectBrush | EraseBrush | WallBrush | BoxBrush | FloorBrush | RefBrush
