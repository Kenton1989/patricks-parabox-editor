import type { LevelBlock, LevelBox, LevelFloor, LevelHeader, LevelRef, LevelWall } from '../level'

export type UpdateHeaderProps = Partial<LevelHeader>

export type UpdateBlockProps = Partial<Omit<LevelBlock, 'blockId'>>

export type UpdateLevelObjectProps<T> = Partial<Omit<T, 'type' | 'objId' | 'parentId'>>

export type UpdateWallProps = UpdateLevelObjectProps<LevelWall>

export type UpdateRefProps = UpdateLevelObjectProps<LevelRef>

export type UpdateBoxProps = UpdateLevelObjectProps<LevelBox>

export type UpdateFloorProps = UpdateLevelObjectProps<LevelFloor>
