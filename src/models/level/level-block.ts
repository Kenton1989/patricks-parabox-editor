import type { LevelObject } from './level-object'
import type { BlockColor } from './property-type'

export type LevelBlock = {
  blockId: number
  name: string
  width: number
  height: number
  color: BlockColor
  zoomFactor: number
  children: LevelObject[]
}
