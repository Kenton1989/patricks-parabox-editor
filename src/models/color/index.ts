// used in the raw level file
export type RawColor = {
  // all props are between 0~1
  hue: number
  sat: number
  val: number
}

// used by VuePrime color picker
export type HsbColor = {
  h: number
  s: number
  b: number
}

// used by Color library
export type HsvColor = {
  h: number
  s: number
  v: number
}
