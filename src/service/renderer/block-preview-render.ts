import { toObjsSortedByLayer, type LevelBlock, type LevelObject } from '@/models/level'
import { bindEverythingToThis } from '../utils'
import { draw } from './ctx-drawer'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './consts'
import { color } from '../convertors'
import type { BlockPreviewsMap } from '@/models/level/previews'
import { estimateRefColor, floorColor } from './factory'

export default class BlockPreviewRenderer {
  private blockMap: Map<number, LevelBlock>
  private levelOfDetails: number
  private canvasWidth: number
  private canvasHeight: number

  public constructor(
    blocks: LevelBlock[],
    levelOfDetails: number,
    canvasWidth: number = CANVAS_WIDTH,
    canvasHeight: number = CANVAS_HEIGHT,
  ) {
    bindEverythingToThis(this)
    this.blockMap = new Map(blocks.map((b) => [b.blockId, b]))
    this.levelOfDetails = levelOfDetails
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  public render(): BlockPreviewsMap {
    let previews = new Map(
      [...this.blockMap].map(([id, block]) => [id, this.renderBlockWithoutRecursion(block)]),
    )

    for (let i = 0; i < this.levelOfDetails; ++i) {
      const newerPreview = new Map(
        [...this.blockMap].map(([id, block]) => [id, this.renderRefOnly(block, previews)]),
      )
      previews = newerPreview
    }

    return previews
  }

  private renderBlockWithoutRecursion(block: LevelBlock): HTMLCanvasElement {
    const [canvas, ctx] = this.createCanvas()
    this.drawUnknownOnError(ctx, 0, 0, canvas.width, canvas.height, () => {
      // sort the floor to the front to render them first
      // if any block is above the floor will be overwritten
      const children = toObjsSortedByLayer(block.children)

      const blockColor = color.blockToColor(block.color)
      const floorClr = floorColor(blockColor)
      draw.rect(ctx, 0, 0, canvas.width, canvas.height, floorClr)

      this.forEachWithCellBox(children, block, (child, x, y, w, h) => {
        this.drawUnknownOnError(ctx, x, y, w, h, () => {
          if (child.type !== 'Ref') {
            draw.levelObject(ctx, x, y, w, h, child, blockColor)
            return
          }

          const referBlock = this.blockMap.get(child.referToBlockId)
          if (referBlock) {
            draw.box(ctx, x, y, w, h, estimateRefColor(referBlock), child.playerSetting)
          } else {
            draw.unknown(ctx, x, y, w, h)
          }
        })
      })
    })

    return canvas
  }

  private renderRefOnly(block: LevelBlock, blockPreviews: BlockPreviewsMap): HTMLCanvasElement {
    const [canvas, ctx] = this.createCanvas(blockPreviews.get(block.blockId))

    this.forEachWithCellBox(block.children, block, (child, x, y, w, h) => {
      this.drawUnknownOnError(ctx, x, y, w, h, () => {
        if (child.type !== 'Ref') return

        const refBlock = this.blockMap.get(child.referToBlockId)
        const refPreview = blockPreviews.get(child.referToBlockId)
        if (!refPreview || !refPreview) {
          draw.unknown(ctx, x, y, w, h)
          return
        }

        draw.ref(ctx, x, y, w, h, child, refBlock, refPreview)
      })
    })

    return canvas
  }

  private forEachWithCellBox(
    children: LevelObject[],
    block: LevelBlock,
    action: (
      child: LevelObject,
      cellX: number,
      cellY: number,
      cellWidth: number,
      cellHeight: number,
    ) => unknown,
  ) {
    const cellW = this.canvasWidth / block.width
    const cellH = this.canvasHeight / block.height

    children.forEach((child) => {
      if (child.x > block.width || child.y > block.height) return

      const x = child.x * cellW
      // reverse y because the y-axis directions in level and canvas are opposite
      const y = (block.height - 1 - child.y) * cellH

      action(child, x, y, cellW, cellH)
    })
  }

  private createCanvas(
    sourceCanvas?: HTMLCanvasElement,
  ): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas')
    canvas.width = sourceCanvas?.width ?? this.canvasWidth
    canvas.height = sourceCanvas?.height ?? this.canvasHeight
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    if (sourceCanvas) {
      ctx.drawImage(sourceCanvas, 0, 0)
    }

    return [canvas, ctx]
  }

  private drawUnknownOnError(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    action: () => unknown,
  ) {
    try {
      action()
    } catch (e) {
      console.log('error when drawing, draw unknown instead:', e)
      draw.unknown(ctx, x, y, w, h)
    }
  }
}
