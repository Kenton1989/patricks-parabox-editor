import type { RawAttemptOrder, RawBlock, RawLevelHeader } from './raw-types'

export const DEFAULT_RAW_ATTEMPT_ORDER: RawAttemptOrder = ['push', 'enter', 'eat', 'possess']

export function createDefaultRawHeader(): RawLevelHeader {
  return {
    type: 'Header',
    version: '4',
    attemptOrder: [...DEFAULT_RAW_ATTEMPT_ORDER],
    shed: false,
    innerPush: false,
    drawStyle: '',
    customLevelMusic: -1,
    customLevelPalette: -1,
  }
}

export function createDefaultRawBlock(): RawBlock {
  return {
    type: 'Block',
    x: 0,
    y: 0,
    id: 0,
    width: 0,
    height: 0,
    hue: 0,
    sat: 0,
    val: 0,
    zoomFactor: 0,
    fillWithWalls: false,
    player: false,
    playerOrder: 0,
    possessable: false,
    flipH: false,
    floatInSpace: false,
    specialEffect: 0,
    children: [],
  }
}
