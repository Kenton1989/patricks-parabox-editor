import {
  type RawBlockChild as RawBlockChildV4,
  type RawBlock as RawBlockV4,
  type RawFloor,
  type RawLevelHeader as RawLevelHeaderV4,
  type RawRef as RawRefV4,
  type RawWall,
} from '@/service/game-level/v4'
import type { LevelHeader } from './level-header'
import type { LevelBlock } from './level-block'
import type { LevelBrick, LevelFloor, LevelObject, LevelRef, LevelWall } from './level-object'
import { createDefaultLevelHeader, newObjId } from './factory'
import type { Hsv, InfSetting, PlayerSetting } from './property-type'
import { NO_INF, NOT_PLAYER, POSSESSABLE } from './consts'

const v4 = {
  toLevelHeader(rawHeader: RawLevelHeaderV4): LevelHeader {
    return {
      ...createDefaultLevelHeader(),
      ...rawHeader,
      drawStyle: rawHeader.drawStyle ? rawHeader.drawStyle : 'default',
    }
  },

  bodyToLevelBlocks(body: RawBlockV4[]): LevelBlock[] {
    return v4.flattenBlocks(body).map(v4.toLevelBlock)
  },

  isBrick(block: RawBlockV4) {
    return block.fillWithWalls
  },

  isComplexBlock(block: RawBlockV4) {
    return !block.fillWithWalls
  },

  flattenBlocks(objects: RawBlockChildV4[]): RawBlockV4[] {
    const result: RawBlockV4[] = []

    for (const child of objects) {
      if (child.type !== 'Block' || !v4.isComplexBlock(child)) {
        continue
      }

      result.push(child, ...v4.flattenBlocks(child.children))
    }

    return result
  },

  toInfSetting(props: RawRefV4): InfSetting {
    if (props.infEnter) {
      return { type: 'infEnter', level: props.infEnterNum, enterFromBlockId: props.infEnterId }
    }

    if (props.infExit) {
      return { type: 'infExit', level: props.infEnterNum }
    }

    return NO_INF
  },

  toHsv(props: { hue: number; sat: number; val: number }): Hsv {
    return [props.hue, props.sat, props.val]
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

  toLevelBlock(block: RawBlockV4): LevelBlock {
    return {
      blockId: block.id,
      name: `Block ${block.id}`,
      width: block.width,
      height: block.height,
      color: [block.hue, block.sat, block.val],
      zoomFactor: block.zoomFactor,
      children: block.children.map((child) => v4.toLevelObject(block.id, child)),
    }
  },

  toLevelObject(parentBlockId: number, child: RawBlockChildV4): LevelObject {
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

  toLevelRef(parentBlockId: number, child: RawRefV4): LevelRef {
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

  toLevelBrick(parentBlockId: number, child: RawBlockV4): LevelBrick {
    return {
      type: 'Brick',
      objId: newObjId(),
      parentBlockId,
      x: child.x,
      y: child.y,
      playerSetting: v4.toPlayerSetting(child),
      color: v4.toHsv(child),
    }
  },

  toExitLevelRef(parentBlockId: number, child: RawBlockV4): LevelRef {
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
