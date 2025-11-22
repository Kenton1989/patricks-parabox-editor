import { describe, it, expect } from 'vitest'

import { LevelParser, LevelParserError } from '../service/game-level/v4'
import { createDefaultRawBlock, createDefaultRawHeader } from '@/service/game-level/v4/consts'

const parse = LevelParser.parse

function runParse(rawLevel: string) {
  return () => parse(rawLevel)
}

const MINIMAL_LEVEL = 'version 4\n#\n'

const SAMPLE_LEVEL = `
version 4
attempt_order enter,possess,push,eat
draw_style oldstyle
#
Block -1 -1 0 9 9 0.6 0.8 1 1 0 0 0 0 0 0 0
	Ref 3 3 0 1 0 0 0 0 -1 0 0 0 0 0 0
	Ref 3 5 0 0 0 0 0 0 -1 0 0 0 0 0 0
	Wall 3 7 0 0 0
	Wall 4 1 0 0 0
	Wall 4 7 0 0 0
	Wall 5 7 0 0 0
	Block 5 3 1 3 3 0.4 0.8 1 1 0 0 0 0 0 0 0
		Ref 1 1 1 1 0 0 0 0 -1 0 0 0 0 0 0
		Floor 1 0 PlayerButton
		Floor 2 0 Button
	Block 5 5 2 5 5 0.9 1 0.7 1 1 1 1 0 0 0 0
`.trim()

function levelWithHeader(key: string, ...props: string[]) {
  return 'version 4\n' + `${key} ${props.join(' ')}\n` + '#'
}

describe('level header parser', () => {
  it('when input minimal level', () => {
    expect(parse(MINIMAL_LEVEL)).toStrictEqual({
      header: createDefaultRawHeader(),
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
    expect(parse(levelWithHeader('attempt_order', 'possess,enter,push,eat'))).toStrictEqual({
      header: { ...createDefaultRawHeader(), attemptOrder: ['possess', 'enter', 'push', 'eat'] },
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

describe('level body parser', () => {
  it('when input minimal level', () => {
    expect(parse(MINIMAL_LEVEL)).toStrictEqual({
      header: createDefaultRawHeader(),
      type: 'Root',
      body: [],
    })
  })

  it('when has a block', () => {
    expect(parse(MINIMAL_LEVEL + 'Block 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n')).toStrictEqual({
      header: createDefaultRawHeader(),
      type: 'Root',
      body: [createDefaultRawBlock()],
    })
  })

  it('when first line has indentation', () => {
    expect(runParse(MINIMAL_LEVEL + '\tBlock')).toThrow()
  })

  it('when first line is not block', () => {
    expect(runParse(MINIMAL_LEVEL + 'Wall 0 0 0 0 0')).toThrow()
  })
})

describe('level parser', () => {
  it('when parse sample level', () => {
    expect(parse(SAMPLE_LEVEL)).toStrictEqual({
      type: 'Root',
      header: {
        type: 'Header',
        version: '4',
        attemptOrder: ['enter', 'possess', 'push', 'eat'],
        shed: false,
        innerPush: false,
        drawStyle: 'oldstyle',
        customLevelMusic: -1,
        customLevelPalette: -1,
      },
      body: [
        {
          type: 'Block',
          x: -1,
          y: -1,
          id: 0,
          width: 9,
          height: 9,
          hue: 0.6,
          sat: 0.8,
          val: 1,
          zoomFactor: 1,
          fillWithWalls: false,
          player: false,
          playerOrder: 0,
          possessable: false,
          flipH: false,
          floatInSpace: false,
          specialEffect: 0,
          children: [
            {
              type: 'Ref',
              x: 3,
              y: 3,
              id: 0,
              exitBlock: true,
              infExit: false,
              infExitNum: 0,
              infEnter: false,
              infEnterNum: 0,
              infEnterId: -1,
              player: false,
              possessable: false,
              playerOrder: 0,
              flipH: false,
              floatInSpace: false,
              specialEffect: 0,
            },
            {
              type: 'Ref',
              x: 3,
              y: 5,
              id: 0,
              exitBlock: false,
              infExit: false,
              infExitNum: 0,
              infEnter: false,
              infEnterNum: 0,
              infEnterId: -1,
              player: false,
              possessable: false,
              playerOrder: 0,
              flipH: false,
              floatInSpace: false,
              specialEffect: 0,
            },
            {
              type: 'Wall',
              x: 3,
              y: 7,
              player: false,
              possessable: false,
              playerOrder: 0,
            },
            {
              type: 'Wall',
              x: 4,
              y: 1,
              player: false,
              possessable: false,
              playerOrder: 0,
            },
            {
              type: 'Wall',
              x: 4,
              y: 7,
              player: false,
              possessable: false,
              playerOrder: 0,
            },
            {
              type: 'Wall',
              x: 5,
              y: 7,
              player: false,
              possessable: false,
              playerOrder: 0,
            },
            {
              type: 'Block',
              x: 5,
              y: 3,
              id: 1,
              width: 3,
              height: 3,
              hue: 0.4,
              sat: 0.8,
              val: 1,
              zoomFactor: 1,
              fillWithWalls: false,
              player: false,
              playerOrder: 0,
              possessable: false,
              flipH: false,
              floatInSpace: false,
              specialEffect: 0,
              children: [
                {
                  type: 'Ref',
                  x: 1,
                  y: 1,
                  id: 1,
                  exitBlock: true,
                  infExit: false,
                  infExitNum: 0,
                  infEnter: false,
                  infEnterNum: 0,
                  infEnterId: -1,
                  player: false,
                  possessable: false,
                  playerOrder: 0,
                  flipH: false,
                  floatInSpace: false,
                  specialEffect: 0,
                },
                {
                  type: 'Floor',
                  x: 1,
                  y: 0,
                  floorType: 'PlayerButton',
                },
                {
                  type: 'Floor',
                  x: 2,
                  y: 0,
                  floorType: 'Button',
                },
              ],
            },
            {
              type: 'Block',
              x: 5,
              y: 5,
              id: 2,
              width: 5,
              height: 5,
              hue: 0.9,
              sat: 1,
              val: 0.7,
              zoomFactor: 1,
              fillWithWalls: true,
              player: true,
              playerOrder: 1,
              possessable: false,
              flipH: false,
              floatInSpace: false,
              specialEffect: 0,
              children: [],
            },
          ],
        },
      ],
    })
  })
})
