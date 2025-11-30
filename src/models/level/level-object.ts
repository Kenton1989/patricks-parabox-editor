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

type CommonProps = {
  objId: number
  parentId: number
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
