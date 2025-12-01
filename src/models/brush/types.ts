import type { LevelBoxInfo, LevelFloorInfo, LevelRefInfo, LevelWallInfo } from '../level'

export type SelectBrush = {
  type: 'Select'
  color?: undefined
}

export type EraseBrush = {
  type: 'Erase'
  color?: undefined
}

export type WallBrush = {
  type: 'Wall'
  color?: undefined
} & LevelWallInfo

export type BoxBrush = {
  type: 'Box'
} & LevelBoxInfo

export type FloorBrush = {
  type: 'Floor'
  color?: undefined
} & LevelFloorInfo

export type RefBrush = {
  type: 'Ref'
  color?: undefined
} & LevelRefInfo

export type Brush = SelectBrush | EraseBrush | WallBrush | BoxBrush | FloorBrush | RefBrush

export type LevelObjectBrush = WallBrush | BoxBrush | FloorBrush | RefBrush
