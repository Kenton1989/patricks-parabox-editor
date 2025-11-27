import type { BlockColor, NoInfSetting, NoPlayerSetting, PossessableSetting } from './property-type'

export const NOT_PLAYER: NoPlayerSetting = { type: 'notPlayer' }

export const POSSESSABLE: PossessableSetting = { type: 'possessable' }

export const NO_INF: NoInfSetting = { type: 'noInf' }

export const DEFAULT_COLORS: (BlockColor & string)[] = [
  'root',
  'color 1',
  'color 2',
  'color 3',
  'player',
  'box',
]
