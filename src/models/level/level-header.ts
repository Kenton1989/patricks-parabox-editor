export type AttemptAction = 'push' | 'enter' | 'eat' | 'possess'

export type AttemptOrder = [AttemptAction, AttemptAction, AttemptAction, AttemptAction]

export type DrawStyle = 'default' | 'tui' | 'grid' | 'oldstyle'

export type LevelHeader = {
  name: string
  author: string
  attemptOrder: AttemptOrder
  shed: boolean
  innerPush: boolean
  drawStyle: DrawStyle
  customLevelMusic: number
  customLevelPalette: number
}
