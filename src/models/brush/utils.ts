import type { LevelObjectBrush, Brush } from './types'

const IS_BLOCK_BRUSH: Record<Brush['type'], boolean> = {
  Select: false,
  Erase: false,
  Wall: true,
  Box: true,
  Floor: true,
  Ref: true,
}

export function isLevelObjectBrush(brush: Brush): brush is LevelObjectBrush {
  return IS_BLOCK_BRUSH[brush.type]
}
