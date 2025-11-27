import type { HsvColor } from '@/models/color'

export type DefaultColor = 'root' | 'color 1' | 'color 2' | 'color 3' | 'box' | 'player'

export type BlockColor = HsvColor | DefaultColor

export type InfEnterSetting = {
  type: 'infEnter'
  level: number
  enterFromBlockId: number
}

export type InfExitSetting = {
  type: 'infExit'
  level: number
}

export type NoInfSetting = {
  type: 'noInf'
}

export type InfSetting = NoInfSetting | InfEnterSetting | InfExitSetting

export type InfType = InfSetting['type']

export type FloorType = 'Button' | 'PlayerButton'

export type ActivePlayerSetting = {
  type: 'player'
  playerOrder: number
}

export type PossessableSetting = {
  type: 'possessable'
}

export type NoPlayerSetting = {
  type: 'notPlayer'
}

export type PlayerSetting = ActivePlayerSetting | PossessableSetting | NoPlayerSetting

export type PlayerSettingType = PlayerSetting['type']
