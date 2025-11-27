import type { HsbColor, HsvColor, RawColor } from '@/models/color'
import type { BlockColor, DefaultColor } from '@/models/level'
import type { ColorInstance } from 'color'
import Color from 'color'

const HUE_TO_DEFAULT_COLOR: { [k: number]: DefaultColor } = {
  0.6: 'color 1',
  0.4: 'color 2',
  0.55: 'color 3',
  0.1: 'box',
  0.9: 'player',
}

function hsvObj(h: number, s: number, v: number): HsvColor {
  return { h, s, v }
}

function hsbObj(h: number, s: number, b: number): HsbColor {
  return { h, s, b }
}

function blockToHsv(block: BlockColor): HsvColor {
  if (typeof block === 'string') {
    switch (block) {
      case 'root':
        return hsvObj(0, 0, 90)
      case 'color 1':
        return hsvObj(216, 80, 100)
      case 'color 2':
        return hsvObj(144, 80, 100)
      case 'color 3':
        return hsvObj(198, 80, 100)
      case 'box':
        return hsvObj(36, 80, 100)
      case 'player':
        return hsvObj(324, 100, 70)
      default:
        throw new RangeError('unknown color name: ' + block)
    }
  }

  return hsvObj(block.h, block.s, block.v)
}

function blockToColor(block: BlockColor): ColorInstance {
  return Color.hsv(blockToHsv(block))
}

function blockToCss(block: BlockColor): string {
  return Color.hsv(blockToHsv(block)).toString()
}

function blockToHsb(block: BlockColor): HsbColor {
  const { h, s, v } = blockToHsv(block)
  return hsbObj(h, s, v)
}

function blockToRaw(block: BlockColor): RawColor {
  const { h, s, v } = blockToHsv(block)
  return {
    hue: h / 360,
    sat: s / 100,
    val: v / 100,
  }
}

function rawToBlock({ hue, sat, val }: RawColor, colorPalette: number = -1): BlockColor {
  if (colorPalette === -1) return hsvObj(hue * 360, sat * 100, val * 100)

  if (sat === 0) return 'root'

  const name = HUE_TO_DEFAULT_COLOR[hue]
  if (name !== undefined) {
    return name
  }

  return hsvObj(hue * 360, sat * 100, val * 100)
}

function hsbToBlock({ h, s, b }: HsbColor): BlockColor {
  return hsvObj(h, s, b)
}

function hsbToColor({ h, s, b }: HsbColor): ColorInstance {
  return Color.hsv(h, s, b)
}

function hsbToCss(hsb: HsbColor): string {
  return hsbToColor(hsb).toString()
}

const color = {
  blockToHsv,
  blockToHsb,
  blockToRaw,
  rawToBlock,
  hsbToBlock,
  hsbToColor,
  blockToColor,
  blockToCss,
  hsbToCss,
}

export { color }
