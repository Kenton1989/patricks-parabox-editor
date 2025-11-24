import type {
  RawBlockChild,
  RawBlock,
  RawFloor,
  RawLevelHeader,
  RawRef,
  RawWall,
} from '@/service/game-level/v4'
import type {
  LevelHeader,
  LevelBlock,
  InfSetting,
  PlayerSetting,
  LevelBrick,
  LevelFloor,
  LevelObject,
  LevelRef,
  LevelWall,
} from '@/models/level'
import { NO_INF, NOT_PLAYER, POSSESSABLE, createDefaultLevelHeader, newObjId } from '@/models/level'
import { color } from './color'

const v4 = {
  toLevelHeader(rawHeader: RawLevelHeader): LevelHeader {
    return {
      ...createDefaultLevelHeader(),
      ...rawHeader,
      drawStyle: rawHeader.drawStyle ? rawHeader.drawStyle : 'default',
    }
  },

  bodyToLevelBlocks(body: RawBlock[]): LevelBlock[] {
    return v4.flattenBlocks(body).map(v4.toLevelBlock)
  },

  isBrick(block: RawBlock) {
    return block.fillWithWalls
  },

  isComplexBlock(block: RawBlock) {
    return !block.fillWithWalls
  },

  flattenBlocks(objects: RawBlockChild[]): RawBlock[] {
    const result: RawBlock[] = []

    for (const child of objects) {
      if (child.type !== 'Block' || !v4.isComplexBlock(child)) {
        continue
      }

      result.push(child, ...v4.flattenBlocks(child.children))
    }

    return result
  },

  toInfSetting(props: RawRef): InfSetting {
    if (props.infEnter) {
      return { type: 'infEnter', level: props.infEnterNum, enterFromBlockId: props.infEnterId }
    }

    if (props.infExit) {
      return { type: 'infExit', level: props.infEnterNum }
    }

    return NO_INF
  },

  toPlayerSetting(props: {
    player: boolean
    possessable: boolean
    playerOrder: number
  }): PlayerSetting {
    if (props.player) {
      return { type: 'player', playerOrder: props.playerOrder }
    }
    if (props.possessable) {
      return POSSESSABLE
    }
    return NOT_PLAYER
  },

  toLevelBlock(block: RawBlock): LevelBlock {
    return {
      blockId: block.id,
      name: `Block ${block.id}`,
      width: block.width,
      height: block.height,
      color: color.rawToBlock(block),
      zoomFactor: block.zoomFactor,
      children: block.children.map((child) => v4.toLevelObject(block.id, child)),
    }
  },

  toLevelObject(parentBlockId: number, child: RawBlockChild): LevelObject {
    switch (child.type) {
      case 'Ref':
        return v4.toLevelRef(parentBlockId, child)
      case 'Floor':
        return v4.toLevelFloor(parentBlockId, child)
      case 'Wall':
        return v4.toLevelWall(parentBlockId, child)
      case 'Block':
        if (v4.isBrick(child)) return v4.toLevelBrick(parentBlockId, child)
        else return v4.toExitLevelRef(parentBlockId, child)
    }
  },

  toLevelRef(parentBlockId: number, child: RawRef): LevelRef {
    return {
      type: 'Ref',
      parentBlockId,
      objId: newObjId(),
      x: child.x,
      y: child.y,
      referToBlockId: child.id,
      exitBlock: child.exitBlock,
      infSetting: v4.toInfSetting(child),
      playerSetting: v4.toPlayerSetting(child),
      flipH: child.flipH,
      floatInSpace: child.floatInSpace,
    }
  },

  toLevelFloor(parentBlockId: number, child: RawFloor): LevelFloor {
    return {
      type: 'Floor',
      parentBlockId,
      objId: newObjId(),
      x: child.x,
      y: child.y,
      floorType: child.floorType,
    }
  },

  toLevelWall(parentBlockId: number, child: RawWall): LevelWall {
    return {
      type: 'Wall',
      parentBlockId,
      objId: newObjId(),
      x: child.x,
      y: child.y,
      playerSetting: v4.toPlayerSetting(child),
    }
  },

  toLevelBrick(parentBlockId: number, child: RawBlock): LevelBrick {
    return {
      type: 'Brick',
      objId: newObjId(),
      parentBlockId,
      x: child.x,
      y: child.y,
      playerSetting: v4.toPlayerSetting(child),
      color: color.rawToBlock(child),
    }
  },

  toExitLevelRef(parentBlockId: number, child: RawBlock): LevelRef {
    return {
      type: 'Ref',
      objId: newObjId(),
      parentBlockId,
      x: child.x,
      y: child.y,
      referToBlockId: child.id,
      exitBlock: true,
      infSetting: NO_INF,
      playerSetting: v4.toPlayerSetting(child),
      flipH: child.flipH,
      floatInSpace: child.floatInSpace,
    }
  },
}

export { v4 }
