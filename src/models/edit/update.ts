import type { LevelBlock, LevelHeader, LevelObject, LevelObjectOfType } from '../level'

export type UpdateHeaderProps = Partial<LevelHeader>

export type UpdateBlockProps = Partial<Omit<LevelBlock, 'blockId' | 'children'>>

export type UpdateObjectProps<T extends LevelObject> = Omit<
  Partial<T>,
  'parentId' | 'type' | 'objId'
>

export type UpdateObjectPropsOfType<ObjTypeT extends LevelObject['type']> = UpdateObjectProps<
  LevelObjectOfType<ObjTypeT>
>
