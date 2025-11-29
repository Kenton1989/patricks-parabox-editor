import type { Immutable } from '../utils'
import type { LevelHeader } from './level-header'
import type { LevelBox, LevelFloor, LevelObject, LevelRef, LevelWall } from './level-object'

export function createDefaultLevelHeader(): LevelHeader {
  return {
    name: 'Level',
    author: 'anonymous',
    attemptOrder: ['push', 'enter', 'eat', 'possess'],
    shed: false,
    innerPush: false,
    drawStyle: 'default',
    customLevelMusic: -1,
    customLevelPalette: -1,
  }
}

let objIdCounter = 1

export function resetObjId(resetTo: number = 1) {
  objIdCounter = resetTo
}

export function newObjId() {
  return objIdCounter++
}

const cast = {
  wall(object?: Immutable<LevelObject>): Immutable<LevelWall> | undefined {
    return object?.type === 'Wall' ? object : undefined
  },
  ref(object?: Immutable<LevelObject>): Immutable<LevelRef> | undefined {
    return object?.type === 'Ref' ? object : undefined
  },
  floor(object?: Immutable<LevelObject>): Immutable<LevelFloor> | undefined {
    return object?.type === 'Floor' ? object : undefined
  },
  box(object?: Immutable<LevelObject>): Immutable<LevelBox> | undefined {
    return object?.type === 'Box' ? object : undefined
  },
}

export { cast }
