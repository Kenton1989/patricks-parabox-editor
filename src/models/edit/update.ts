import type {
  LevelBlock,
  LevelBox,
  LevelFloor,
  LevelHeader,
  LevelObject,
  LevelRef,
  LevelWall,
} from '../level'

export type UpdateHeaderProps = Partial<LevelHeader>

export type UpdateBlockProps = Partial<Omit<LevelBlock, 'blockId'>>

export type GenericUpdateObjectProps<T extends LevelObject> = Omit<
  Pick<T, 'type' | 'objId'> & Partial<T>,
  'parentId'
>

export type UpdateWallProps = GenericUpdateObjectProps<LevelWall>

export type UpdateRefProps = GenericUpdateObjectProps<LevelRef>

export type UpdateBoxProps = GenericUpdateObjectProps<LevelBox>

export type UpdateFloorProps = GenericUpdateObjectProps<LevelFloor>

export type UpdateObjectProps = UpdateWallProps | UpdateRefProps | UpdateBoxProps | UpdateFloorProps
