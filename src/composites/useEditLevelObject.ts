import type { UpdateObjectPropsOfType } from '@/models/edit'
import type { LevelObject } from '@/models/level'
import { useLevelStore } from '@/stores/level'

export default function useEditLevelObject<
  T extends LevelObject,
  ObjType extends T['type'] = T['type'],
>(obj: T) {
  const levelStore = useLevelStore()

  const update = (values: UpdateObjectPropsOfType<ObjType>) => {
    levelStore.updateObject(obj.type, obj.objId, values)
  }

  const updateNoCommit = (values: UpdateObjectPropsOfType<ObjType>) => {
    levelStore.updateObject(obj.type, obj.objId, values, true)
  }

  return { update, commit: levelStore.commitEditHistory, updateNoCommit }
}
