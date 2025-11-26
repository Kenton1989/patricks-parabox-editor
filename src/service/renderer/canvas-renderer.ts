import type { LevelBlock } from '@/models/level'
import BlockPreviewRenderer from './block-preview-render'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './consts'
import type { BlockPreviewsMap } from '@/models/level/previews'
import { draw } from './ctx-drawer'

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
}

export { render }
