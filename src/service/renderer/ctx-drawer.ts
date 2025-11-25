import type {
  FloorType,
  LevelBlock,
  LevelObject,
  LevelRef,
  PlayerSetting,
  PlayerSettingType,
} from '@/models/level'
import {
  BORDER_WIDTH,
  CLONE_OVERLAY_COLOR,
  EYE_RADIUS,
  EYE_Y_OFFSET,
  INF_OVERLAY_COLOR,
  L_EYE_X_OFFSET,
  PUPIL_RADIUS,
  R_EYE_X_OFFSET,
  TARGET_FLOOR_BORDER_PADDING,
  TARGET_FLOOR_BORDER_WIDTH,
  TARGET_FLOOR_OVERLAY_COLOR,
  WALL_CENTER_WIDTH,
  WALL_LIGHT_OVERLAY,
  WALL_SHADE_OVERLAY,
} from './consts'
import { type ColorInstance } from 'color'
import { color } from '../convertors'
import { borderColor, eyeColor, floorColor, wallColor } from './factory'

// define some drawing operations to apply on a pre-existing canvas context
// no new context will be created
const draw = {
  levelObject(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    obj: LevelObject,
    parentColor: ColorInstance,
  ) {
    switch (obj.type) {
      case 'Ref':
        throw Error('ref is not supported')
      case 'Brick':
        draw.brick(ctx, x, y, w, h, color.blockToColor(obj.color), obj.playerSetting)
        return
      case 'Wall':
        draw.wall(ctx, x, y, w, h, parentColor)
        return
      case 'Floor':
        draw.floor(ctx, x, y, w, h, parentColor, obj.floorType)
        return
    }
  },

  wall(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    parentColor: ColorInstance,
  ) {
    const colorStr = wallColor(parentColor)

    const [x1, y1] = [x + w, y + h]
    const [cw, ch] = [w * WALL_CENTER_WIDTH, h * WALL_CENTER_WIDTH]
    const [cx, cy] = [x + (w - cw) / 2, y + (h - ch) / 2]

    ctx.fillStyle = colorStr
    ctx.fillRect(x, y, w, h)

    ctx.fillStyle = WALL_LIGHT_OVERLAY
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x1, y)
    ctx.lineTo(x, y1)
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = WALL_SHADE_OVERLAY
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x1, y)
    ctx.lineTo(x, y1)
    ctx.lineTo(x1, y1)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = colorStr
    ctx.fillRect(cx, cy, cw, ch)
  },

  unknown(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const [halfW, halfH] = [w * 0.5, h * 0.5]
    const [centerX, centerY] = [x + halfW, y + halfH]
    ctx.fillStyle = 'purple'
    ctx.fillRect(x, y, halfW, halfH)
    ctx.fillRect(centerX, centerY, halfW, halfH)
    ctx.fillStyle = 'black'
    ctx.fillRect(x, centerY, halfW, halfH)
    ctx.fillRect(centerX, y, halfW, halfH)
  },

  ref(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ref: LevelRef,
    refSrc: LevelBlock | undefined,
    refBlockPreview: HTMLCanvasElement | undefined,
  ) {
    if (!refSrc || !refBlockPreview) {
      draw.unknown(ctx, x, y, w, h)
      return
    }

    draw.canvasCopy(ctx, x, y, w, h, refBlockPreview, ref.flipH)

    const borderClr = borderColor(color.blockToColor(refSrc.color))
    draw.border(ctx, x, y, w, h, borderClr)

    if (!ref.exitBlock) {
      ctx.fillStyle = CLONE_OVERLAY_COLOR
      ctx.fillRect(x, y, w, h)
    }

    if (ref.infSetting.type !== 'noInf') {
      ctx.fillStyle = INF_OVERLAY_COLOR
      ctx.fillRect(x, y, w, h)
    }

    const colorBase = color.blockToColor(refSrc.color)
    draw.face(ctx, x, y, w, h, colorBase, ref.playerSetting)
  },

  brick(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    brickColor: ColorInstance,
    playerSetting: PlayerSetting,
  ) {
    ctx.fillStyle = brickColor.toString()
    ctx.fillRect(x, y, w, h)
    draw.border(ctx, x, y, w, h, borderColor(brickColor))
    draw.face(ctx, x, y, w, h, brickColor, playerSetting)
  },

  floor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    parentColor: ColorInstance,
    floorType: FloorType,
  ) {
    let [dx, dy] = [w * TARGET_FLOOR_BORDER_PADDING, h * TARGET_FLOOR_BORDER_PADDING]
    const floorClr = floorColor(parentColor)

    ctx.fillStyle = floorClr
    ctx.fillRect(x, y, w, h)

    ctx.fillStyle = TARGET_FLOOR_OVERLAY_COLOR
    ctx.fillRect(x + dx, y + dy, w - 2 * dx, h - 2 * dy)
    ;[dx, dy] = [dx + w * TARGET_FLOOR_BORDER_WIDTH, dy + h * TARGET_FLOOR_BORDER_WIDTH]
    ctx.fillStyle = floorClr
    ctx.fillRect(x + dx, y + dy, w - 2 * dx, h - 2 * dy)

    if (floorType === 'PlayerButton') {
      draw.eyes(ctx, x, y, w, h, TARGET_FLOOR_OVERLAY_COLOR)
    }
  },

  face(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    colorBase: ColorInstance,
    playerSetting: PlayerSetting,
  ) {
    if (playerSetting.type !== 'notPlayer') {
      const eyeClr = eyeColor(colorBase)
      draw.eyes(ctx, x, y, w, h, eyeClr, playerSetting.type)
    }
  },

  canvasCopy(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    canvas: HTMLCanvasElement,
    flipH: boolean = false,
  ) {
    const [srcX, srcY, srcW, srcH] = [0, 0, canvas.width, canvas.height]
    if (!flipH) {
      ctx.drawImage(canvas, srcX, srcY, srcW, srcH, x, y, w, h)
      return
    }

    const destCanvas = ctx.canvas

    // for ctx.restore() later
    ctx.save()

    // flip the destination canvas horizontally
    ctx.translate(destCanvas.width, 0)
    ctx.scale(-1, 1)

    // draw ref on flipped position
    const flippedX = destCanvas.width - x - w
    draw.canvasCopy(ctx, flippedX, y, w, h, canvas)

    // undo flipping
    ctx.restore()
  },

  rect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string | ColorInstance,
  ) {
    ctx.fillStyle = color.toString()
    ctx.fillRect(x, y, w, h)
  },

  border(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string | ColorInstance,
  ) {
    const [x1, y1] = [x + 0.5 * BORDER_WIDTH * w, y + 0.5 * BORDER_WIDTH * h]
    const [x2, y2] = [x + (1 - 0.5 * BORDER_WIDTH) * w, y + (1 - 0.5 * BORDER_WIDTH) * h]
    const [vLineWidth, hLineWidth] = [BORDER_WIDTH * w, BORDER_WIDTH * h]

    ctx.fillStyle = color.toString()
    ctx.lineCap = 'square'

    ctx.lineWidth = hLineWidth
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y1)
    ctx.moveTo(x1, y2)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    ctx.lineWidth = vLineWidth
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x1, y2)
    ctx.moveTo(x2, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  },

  eyes(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string | ColorInstance,
    type: PlayerSettingType = 'player',
  ) {
    const lEyeX = x + L_EYE_X_OFFSET * w
    const rEyeX = x + R_EYE_X_OFFSET * w
    const eyeY = y + EYE_Y_OFFSET * h
    const len = w
    const outerR = EYE_RADIUS * len
    const innerR = type === 'player' ? 0 : PUPIL_RADIUS * len
    const colorStr = color.toString()

    draw.ring(ctx, colorStr, lEyeX, eyeY, innerR, outerR)
    draw.ring(ctx, colorStr, rEyeX, eyeY, innerR, outerR)
  },

  ring(
    ctx: CanvasRenderingContext2D,
    color: string | ColorInstance,
    x: number,
    y: number,
    innerR: number,
    outerR: number,
  ) {
    const colorStr = color.toString()

    const gradient = ctx.createRadialGradient(x, y, innerR, x, y, outerR)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(0.001, colorStr)
    gradient.addColorStop(1, colorStr)

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, outerR, 0, Math.PI * 2)
    ctx.fill()
  },
}

export { draw }
