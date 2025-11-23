import type { LevelHeader } from './level-header'

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
