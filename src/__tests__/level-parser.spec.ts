import { describe, it, expect } from 'vitest'

import { LevelParser, LevelParserError } from '../service/game-level/v4'
import { DEFAULT_RAW_HEADER } from '@/service/game-level/v4/consts'

const parse = LevelParser.parse

function runParse(rawLevel: string) {
  return () => parse(rawLevel)
}

const MINIMAL_LEVEL = 'version 4\n#'

function levelWithHeader(key: string, ...props: string[]) {
  return 'version 4\n' + `${key} ${props.join(' ')}\n` + '#'
}

describe('level parser', () => {
  it('when input minimal level', () => {
    expect(parse(MINIMAL_LEVEL)).toStrictEqual({
      header: DEFAULT_RAW_HEADER,
      type: 'Root',
      body: [],
    })
  })

  it('when input is empty', () => {
    expect(runParse('')).toThrow(LevelParserError)
  })

  it('when input has only empty line', () => {
    expect(runParse('\n')).toThrow(LevelParserError)
  })

  it('when input has leading empty line', () => {
    expect(runParse('\n' + MINIMAL_LEVEL)).toThrow(LevelParserError)
  })

  it('when first line is not version', () => {
    expect(runParse('custom_level_palette 0\n' + MINIMAL_LEVEL)).toThrow(LevelParserError)
  })

  it('when missing header ender', () => {
    expect(runParse('version 4\n')).toThrow(LevelParserError)
  })

  it('when header has indent', () => {
    expect(runParse('\t' + MINIMAL_LEVEL)).toThrow(LevelParserError)
  })

  it('when header is known', () => {
    expect(parse(levelWithHeader('attempt_order', 'push,enter,eat,possess'))).toBeDefined()
    expect(parse(levelWithHeader('shed')).header.shed).toBe(true)
    expect(parse(levelWithHeader('inner_push')).header.innerPush).toBe(true)
    expect(parse(levelWithHeader('draw_style', 'tui')).header.drawStyle).toBe('tui')
    expect(parse(levelWithHeader('custom_level_music', '1')).header.customLevelMusic).toBe(1)
    expect(parse(levelWithHeader('custom_level_palette', '1')).header.customLevelPalette).toBe(1)
  })

  it('when the count of props of version is not 1', () => {
    expect(runParse('version \n#')).toThrow(LevelParserError)
    expect(runParse('version 4 4\n#')).toThrow(LevelParserError)
  })

  it('when attempt order is valid', () => {
    expect(parse(levelWithHeader('attempt_order', 'push,enter,eat,possess'))).toStrictEqual({
      header: { ...DEFAULT_RAW_HEADER, attemptOrder: ['push', 'enter', 'eat', 'possess'] },
      type: 'Root',
      body: [],
    })
  })

  it('when attempt order is invalid', () => {
    expect(runParse(levelWithHeader('attempt_order', 'poop,enter,eat,possess'))).toThrow(
      LevelParserError,
    )
  })

  it('when attempt order value is missing', () => {
    expect(runParse(levelWithHeader('attempt_order'))).toThrow(LevelParserError)
  })

  it('when attempt order value has too many props', () => {
    expect(runParse(levelWithHeader('attempt_order', 'push', 'enter', 'eat', 'possess'))).toThrow(
      LevelParserError,
    )
  })
})
