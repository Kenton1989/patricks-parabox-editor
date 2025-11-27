import type { BoxBrush, EraseBrush, FloorBrush, RefBrush, SelectBrush, WallBrush } from './types'

const BASE_BRUSH = {
  select: { type: 'select' } as SelectBrush,

  erase: {
    type: 'erase',
  } as EraseBrush,

  wall: {
    type: 'wall',
  } as WallBrush,

  box: {
    type: 'box',
    color: 'box',
    player: false,
  } as BoxBrush,

  player: {
    type: 'box',
    color: 'player',
    player: true,
  } as BoxBrush,

  floor: {
    type: 'floor',
    playerFloor: false,
  } as FloorBrush,

  playerFloor: {
    type: 'floor',
    playerFloor: true,
  } as FloorBrush,

  ref: {
    type: 'ref',
    blockId: 0,
  } as RefBrush,
}

export { BASE_BRUSH }
