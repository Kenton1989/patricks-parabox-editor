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
