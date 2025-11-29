import type { LevelBlock, LevelBox, LevelFloor, LevelObject, LevelRef, LevelWall } from '../level'

export type CreateBlockProps = Omit<LevelBlock, 'blockId'>

export type GenericCreateObjectProps<T extends LevelObject> = Omit<T, 'objId'>

export type CreateWallProps = GenericCreateObjectProps<LevelWall>

export type CreateRefProps = GenericCreateObjectProps<LevelRef>

export type CreateBoxProps = GenericCreateObjectProps<LevelBox>

export type CreateFloorProps = GenericCreateObjectProps<LevelFloor>

export type CreateObjectProps = CreateWallProps | CreateRefProps | CreateBoxProps | CreateFloorProps
