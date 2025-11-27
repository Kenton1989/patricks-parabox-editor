import type { BlockColor, FloorType, InfSetting, PlayerSetting } from './property-type'

export type LevelObject = LevelRef | LevelBox | LevelWall | LevelFloor

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

export type LevelBox = CommonProps & {
  type: 'Box'
  playerSetting: PlayerSetting
  color: BlockColor
}

export type LevelWall = CommonProps & {
  type: 'Wall'
  playerSetting: PlayerSetting
}

export type LevelFloor = CommonProps & {
  type: 'Floor'
  floorType: FloorType
}
