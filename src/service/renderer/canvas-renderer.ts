import type {
  BlockColor,
  LevelBlock,
  LevelBox,
  LevelFloor,
  LevelRef,
  LevelWall,
} from '@/models/level'
import BlockPreviewRenderer from './block-preview-render'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './consts'
import type { BlockPreviewsMap } from '@/models/level/previews'
import { draw } from './ctx-drawer'
import { color } from '../convertors'

// define a object to generate/draw HTML canvas element
const render = {
  blockPreviews(
    blocks: LevelBlock[],
    levelOfDetails = 3,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT,
  ): BlockPreviewsMap {
    const renderer = new BlockPreviewRenderer(blocks, levelOfDetails, width, height)
    return renderer.render()
  },

  copy(targetCanvas: HTMLCanvasElement, sourceCanvas: HTMLCanvasElement, followSourceSize = true) {
    if (followSourceSize) {
      targetCanvas.width = sourceCanvas.width
      targetCanvas.height = sourceCanvas.height
    }

    const ctx = targetCanvas.getContext('2d') as CanvasRenderingContext2D

    draw.canvasCopy(ctx, 0, 0, targetCanvas.width, targetCanvas.height, sourceCanvas)
  },

  unknown(targetCanvas: HTMLCanvasElement, width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
    targetCanvas.width = width
    targetCanvas.height = height

    const ctx = targetCanvas.getContext('2d') as CanvasRenderingContext2D
    draw.unknown(ctx, 0, 0, width, height)
  },

  wall(
    targetCanvas: HTMLCanvasElement,
    wall: LevelWall,
    parentColor: BlockColor,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT,
  ) {
    targetCanvas.width = width
    targetCanvas.height = height

    const baseColor = color.blockToColor(parentColor)

    const ctx = targetCanvas.getContext('2d') as CanvasRenderingContext2D

    draw.wall(ctx, 0, 0, width, height, baseColor, wall.playerSetting)
  },

  box(
    targetCanvas: HTMLCanvasElement,
    box: LevelBox,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT,
  ) {
    targetCanvas.width = width
    targetCanvas.height = height

    const baseColor = color.blockToColor(box.color)

    const ctx = targetCanvas.getContext('2d') as CanvasRenderingContext2D

    draw.box(ctx, 0, 0, width, height, baseColor, box.playerSetting)
  },

  floor(
    targetCanvas: HTMLCanvasElement,
    floor: LevelFloor,
    parentColor?: BlockColor, // if undefined, draw with transparent background
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT,
  ) {
    targetCanvas.width = width
    targetCanvas.height = height

    const ctx = targetCanvas.getContext('2d') as CanvasRenderingContext2D

    const baseColor = parentColor ? color.blockToColor(parentColor) : undefined
    if (baseColor) {
      draw.floor(ctx, 0, 0, width, height, baseColor, floor.floorType)
    } else {
      draw.transparentFloor(ctx, 0, 0, width, height, floor.floorType)
    }
  },

  ref(
    targetCanvas: HTMLCanvasElement,
    ref: LevelRef,
    refSrc: LevelBlock,
    blockPreview: HTMLCanvasElement,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT,
  ) {
    targetCanvas.width = width
    targetCanvas.height = height

    const ctx = targetCanvas.getContext('2d') as CanvasRenderingContext2D

    draw.ref(ctx, 0, 0, width, height, ref, refSrc, blockPreview)
  },
}

export { render }
