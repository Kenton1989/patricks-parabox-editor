import type { LevelBlock } from '@/models/level'
import { type ColorInstance } from 'color'
import { color } from '../convertors'

export const eyeColor = (color: ColorInstance) => color.darken(0.7).string()

export const wallColor = (colorBase: ColorInstance) => colorBase.string()

export const borderColor = (colorBase: ColorInstance) => colorBase.darken(0.7).string()

export const floorColor = (colorBase: ColorInstance) =>
  colorBase.darken(0.5).desaturate(0.33).string()

export function estimateRefColor(block: LevelBlock) {
  const cellCount = block.width * block.height
  const wallCount = block.children.reduce((cnt, val) => cnt + Number(val.type === 'Wall'), 0)
  const wallRatio = wallCount / cellCount

  const colorBase = color.blockToColor(block.color)
  return colorBase.darken(0.5 + wallRatio * 0.5).desaturate(0.33 + wallRatio * 0.67)
}
