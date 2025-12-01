import type { BoxBrush, EraseBrush, FloorBrush, SelectBrush, WallBrush } from './types'

const BASE_BRUSH = {
  select: { type: 'Select' } as SelectBrush,

  erase: {
    type: 'Erase',
  } as EraseBrush,

  wall: {
    type: 'Wall',
  } as WallBrush,

  box: {
    type: 'Box',
    color: 'box',
    playerSetting: { type: 'notPlayer' },
  } as BoxBrush,

  player: {
    type: 'Box',
    color: 'player',
    playerSetting: { type: 'player', playerOrder: 0 },
  } as BoxBrush,

  floor: {
    type: 'Floor',
    floorType: 'Button',
  } as FloorBrush,

  playerFloor: {
    type: 'Floor',
    floorType: 'PlayerButton',
  } as FloorBrush,
}

export { BASE_BRUSH }
