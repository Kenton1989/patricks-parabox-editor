export function drawUnknown(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const [halfW, halfH] = [w * 0.5, h * 0.5]
  const [centerX, centerY] = [x + halfW, y + halfH]
  ctx.fillStyle = 'magenta'
  ctx.fillRect(x, y, halfW, halfH)
  ctx.fillRect(centerX, centerY, halfW, halfH)
  ctx.fillStyle = 'black'
  ctx.fillRect(x, centerY, halfW, halfH)
  ctx.fillRect(centerX, y, halfW, halfH)
}

export function drawUnknownOnError(
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
    drawUnknown(ctx, x, y, w, h)
  }
}
