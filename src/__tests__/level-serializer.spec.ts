import { describe, expect, it } from 'vitest'

import { v4 } from '@/service/convertors'
import { LevelParser, LevelSerializer } from '@/service/game-level/v4'
import { createDefaultLevelHeader, type LevelBlock } from '@/models/level'

describe('level serializer', () => {
  it('serializes a minimal level that can be parsed again', () => {
    const rawLevel = v4.fromLevel(createDefaultLevelHeader(), [])
    const serialized = LevelSerializer.serialize(rawLevel)

    expect(serialized).toBe('version 4\n#')
    expect(LevelParser.parse(serialized)).toStrictEqual(rawLevel)
  })

  it('serializes every editor block as a root block and keeps exit refs as refs', () => {
    const blocks: LevelBlock[] = [
      {
        blockId: 0,
        name: 'Root',
        width: 5,
        height: 5,
        color: 'root',
        zoomFactor: 1,
        children: [
          {
            type: 'Ref',
            objId: 1,
            parentId: 0,
            x: 2,
            y: 2,
            referToBlockId: 1,
            exitBlock: true,
            infSetting: { type: 'noInf' },
            playerSetting: { type: 'notPlayer' },
            flipH: false,
            floatInSpace: false,
          },
        ],
      },
      {
        blockId: 1,
        name: 'Nested',
        width: 3,
        height: 3,
        color: 'color 1',
        zoomFactor: 1,
        children: [
          {
            type: 'Wall',
            objId: 2,
            parentId: 1,
            x: 1,
            y: 1,
            playerSetting: { type: 'notPlayer' },
          },
        ],
      },
    ]

    const serialized = LevelSerializer.serialize(v4.fromLevel(createDefaultLevelHeader(), blocks))

    expect(serialized.split('\n').filter((line) => line.startsWith('Block '))).toHaveLength(2)
    expect(serialized).toContain('\tRef 2 2 1 1 0 0 0 0 -1 0 0 0 0 0 0')
    expect(LevelParser.parse(serialized).body).toHaveLength(2)
  })

  it('round-trips supported object settings through parse', () => {
    const blocks: LevelBlock[] = [
      {
        blockId: 0,
        name: 'Root',
        width: 4,
        height: 4,
        color: 'root',
        zoomFactor: 1,
        children: [
          {
            type: 'Floor',
            objId: 1,
            parentId: 0,
            x: 0,
            y: 0,
            floorType: 'PlayerButton',
          },
          {
            type: 'Box',
            objId: 2,
            parentId: 0,
            x: 1,
            y: 0,
            color: 'box',
            playerSetting: { type: 'player', playerOrder: 1 },
          },
          {
            type: 'Ref',
            objId: 3,
            parentId: 0,
            x: 2,
            y: 0,
            referToBlockId: 1,
            exitBlock: false,
            infSetting: { type: 'infEnter', level: 2, enterFromBlockId: 0 },
            playerSetting: { type: 'possessable' },
            flipH: true,
            floatInSpace: true,
          },
        ],
      },
      {
        blockId: 1,
        name: 'Target',
        width: 2,
        height: 2,
        color: 'color 2',
        zoomFactor: 1,
        children: [],
      },
    ]

    const rawLevel = v4.fromLevel(createDefaultLevelHeader(), blocks)
    const serialized = LevelSerializer.serialize(rawLevel)
    const reparsed = LevelParser.parse(serialized)

    expect(serialized).toContain('\tBlock 1 0 -1 1 1 0.1 0.8 1 1 1 1 0 1 0 0 0')
    expect(reparsed).toStrictEqual(rawLevel)
  })

  it('imports inf exit refs from infexitnum', () => {
    const levelBlocks = v4.bodyToLevelBlocks(
      LevelParser.parse(
        'version 4\n#\nBlock -1 -1 0 3 3 0 0 0.9 1 0 0 0 0 0 0 0\n\tRef 1 1 0 0 1 3 0 0 -1 0 0 0 0 0 0',
      ).body,
    )

    expect(levelBlocks[0]!.children[0]).toMatchObject({
      type: 'Ref',
      infSetting: { type: 'infExit', level: 3 },
    })
  })
})
