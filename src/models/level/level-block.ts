import type { LevelObject } from './level-object'
import type { Hsv } from './property-type'

export type LevelBlock = {
  blockId: number
  name: string
  width: number
  height: number
  color: Hsv
  zoomFactor: number
  children: LevelObject[]
}
