export type RawAttemptAction = 'push' | 'enter' | 'eat' | 'possess'

export type RawAttemptOrder = [
  RawAttemptAction,
  RawAttemptAction,
  RawAttemptAction,
  RawAttemptAction,
]

export type RawDrawStyle = '' | 'tui' | 'grid' | 'oldstyle'

export interface RawLevelHeader {
  type: 'Header'
  version: '4'
  attemptOrder: RawAttemptOrder
  shed: boolean
  innerPush: boolean
  drawStyle: RawDrawStyle
  customLevelMusic: number
  customLevelPalette: number
}

export interface RawLevelRoot {
  type: 'Root'
  header: RawLevelHeader
  body: RawBlock[]
}

export type RawBlockChild = RawBlock | RawRef | RawWall | RawFloor

export interface RawBlock {
  type: 'Block'
  x: number
  y: number
  id: number
  width: number
  height: number
  hue: number
  sat: number
  val: number
  zoomFactor: number
  fillWithWalls: boolean
  player: boolean
  playerOrder: number
  possessable: boolean
  flipH: boolean
  floatInSpace: boolean
  specialEffect: number
  children: RawBlockChild[]
}

export interface RawRef {
  type: 'Ref'
  x: number
  y: number
  id: number
  exitBlock: boolean
  infExit: boolean
  infExitNum: number
  infEnter: boolean
  infEnterNum: number
  infEnterId: number
  player: boolean
  possessable: boolean
  playerOrder: number
  flipH: boolean
  floatInSpace: boolean
  specialEffect: number
}

export interface RawWall {
  type: 'Wall'
  x: number
  y: number
  player: boolean
  possessable: boolean
  playerOrder: number
}

export type RawFloorType = 'PlayerButton' | 'Button'

export interface RawFloor {
  type: 'Floor'
  x: number
  y: number
  floorType: RawFloorType
}
