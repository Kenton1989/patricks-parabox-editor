import type { Immutable } from '../utils'
import type {
  ActivePlayerSetting,
  BlockColor,
  FloorType,
  InfSetting,
  PlayerSetting,
} from './property-type'

export type LevelObject = LevelRef | LevelBox | LevelWall | LevelFloor

export type MovableLevelObject = LevelRef | LevelBox | LevelWall

export type PlayerLevelObject = MovableLevelObject & { playerSetting: ActivePlayerSetting }

type LabelObjCommonProps = {
  objId: number
  parentId: number
  x: number
  y: number
}

export type TypeFlag<T extends string> = {
  type: T
}

export type LevelRefInfo = {
  referToBlockId: number
  exitBlock: boolean
  infSetting: InfSetting
  playerSetting: PlayerSetting
  flipH: boolean
  floatInSpace: boolean
}

export type LevelWallInfo = {
  playerSetting: PlayerSetting
}

export type LevelBoxInfo = {
  playerSetting: PlayerSetting
  color: BlockColor
}

export type LevelFloorInfo = {
  floorType: FloorType
}

export type LevelRef = TypeFlag<'Ref'> & LabelObjCommonProps & LevelRefInfo

export type LevelBox = TypeFlag<'Box'> & LabelObjCommonProps & LevelBoxInfo

export type LevelWall = TypeFlag<'Wall'> & LabelObjCommonProps & LevelWallInfo

export type LevelFloor = TypeFlag<'Floor'> & LabelObjCommonProps & LevelFloorInfo

export type LevelObjectOfType<TypeT extends LevelObject['type']> = TypeT extends 'Ref'
  ? LevelRef
  : TypeT extends 'Box'
    ? LevelBox
    : TypeT extends 'Wall'
      ? LevelWall
      : TypeT extends 'Floor'
        ? LevelFloor
        : never

export function objLayer(obj: LevelObject): number {
  return Number(obj.type !== 'Floor')
}

export function cmpObjLayer(o1: LevelObject, o2: LevelObject): number {
  return objLayer(o1) - objLayer(o2)
}

export function sortObjInPlaceByLayer(objs: LevelObject[]): LevelObject[] {
  return objs.sort((o1, o2) => cmpObjLayer(o1, o2) || o1.objId - o2.objId)
}

export function toObjsSortedByLayer(objs: Immutable<LevelObject[]>): LevelObject[] {
  return sortObjInPlaceByLayer([...objs])
}
