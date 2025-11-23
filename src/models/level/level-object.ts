import type { FloorType, Hsv, InfSetting, PlayerSetting } from './property-type'

export type LevelObject = LevelRef | LevelBrick | LevelWall | LevelFloor

type CommonProps = {
  objId: number
  parentBlockId: number
  x: number
  y: number
}

export type LevelRef = CommonProps & {
  type: 'Ref'
  referToBlockId: number
  exitBlock: boolean
  infSetting: InfSetting
  playerSetting: PlayerSetting
  flipH: boolean
  floatInSpace: boolean
}

export type LevelBrick = CommonProps & {
  type: 'Brick'
  playerSetting: PlayerSetting
  color: Hsv
}

export type LevelWall = CommonProps & {
  type: 'Wall'
  playerSetting: PlayerSetting
}

export type LevelFloor = CommonProps & {
  type: 'Floor'
  floorType: FloorType
}
