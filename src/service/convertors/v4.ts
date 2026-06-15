import type {
  RawBlockChild,
  RawBlock,
  RawFloor,
  RawLevelRoot,
  RawLevelHeader,
  RawRef,
  RawWall,
} from '@/service/game-level/v4'
import type {
  LevelHeader,
  LevelBlock,
  InfSetting,
  PlayerSetting,
  LevelBox,
  LevelFloor,
  LevelObject,
  LevelRef,
  LevelWall,
} from '@/models/level'
import { NO_INF, NOT_PLAYER, POSSESSABLE, createDefaultLevelHeader } from '@/models/level'
import type { Immutable } from '@/models/utils'
import { color } from './color'

let objIdCounter = 1

export function resetObjId(resetTo: number = 1) {
  objIdCounter = resetTo
}

export function newObjId() {
  return objIdCounter++
}

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

  isBox(block: RawBlock) {
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
      return { type: 'infExit', level: props.infExitNum }
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
        if (v4.isBox(child)) return v4.toLevelBox(parentBlockId, child)
        else return v4.toExitLevelRef(parentBlockId, child)
    }
  },

  toLevelRef(parentBlockId: number, child: RawRef): LevelRef {
    return {
      type: 'Ref',
      parentId: parentBlockId,
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
      parentId: parentBlockId,
      objId: newObjId(),
      x: child.x,
      y: child.y,
      floorType: child.floorType,
    }
  },

  toLevelWall(parentBlockId: number, child: RawWall): LevelWall {
    return {
      type: 'Wall',
      parentId: parentBlockId,
      objId: newObjId(),
      x: child.x,
      y: child.y,
      playerSetting: v4.toPlayerSetting(child),
    }
  },

  toLevelBox(parentBlockId: number, child: RawBlock): LevelBox {
    return {
      type: 'Box',
      objId: newObjId(),
      parentId: parentBlockId,
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
      parentId: parentBlockId,
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

  fromLevel(header: Immutable<LevelHeader>, blocks: Immutable<LevelBlock[]>): RawLevelRoot {
    return {
      type: 'Root',
      header: v4.fromLevelHeader(header),
      body: v4.levelBlocksToBody(blocks),
    }
  },

  fromLevelHeader(header: Immutable<LevelHeader>): RawLevelHeader {
    return {
      type: 'Header',
      version: '4',
      attemptOrder: [
        header.attemptOrder[0]!,
        header.attemptOrder[1]!,
        header.attemptOrder[2]!,
        header.attemptOrder[3]!,
      ],
      shed: header.shed,
      innerPush: header.innerPush,
      drawStyle: header.drawStyle === 'default' ? '' : header.drawStyle,
      customLevelMusic: header.customLevelMusic,
      customLevelPalette: header.customLevelPalette,
    }
  },

  levelBlocksToBody(blocks: Immutable<LevelBlock[]>): RawBlock[] {
    return blocks.map((block) => v4.fromLevelBlock(block))
  },

  fromLevelBlock(block: Immutable<LevelBlock>): RawBlock {
    const { hue, sat, val } = color.blockToRaw(block.color)

    return {
      type: 'Block',
      x: -1,
      y: -1,
      id: block.blockId,
      width: block.width,
      height: block.height,
      hue,
      sat,
      val,
      zoomFactor: block.zoomFactor,
      fillWithWalls: false,
      player: false,
      playerOrder: 0,
      possessable: false,
      flipH: false,
      floatInSpace: false,
      specialEffect: 0,
      children: block.children.map((child) => v4.fromLevelObject(child)),
    }
  },

  fromLevelObject(obj: Immutable<LevelObject>): RawBlockChild {
    switch (obj.type) {
      case 'Ref':
        return v4.fromLevelRef(obj)
      case 'Floor':
        return v4.fromLevelFloor(obj)
      case 'Wall':
        return v4.fromLevelWall(obj)
      case 'Box':
        return v4.fromLevelBox(obj)
    }
  },

  rawPlayerProps(playerSetting: Immutable<PlayerSetting>) {
    return {
      player: playerSetting.type === 'player',
      playerOrder: playerSetting.type === 'player' ? playerSetting.playerOrder : 0,
      possessable: playerSetting.type === 'possessable',
    }
  },

  fromLevelRef(obj: Immutable<LevelRef>): RawRef {
    return {
      type: 'Ref',
      x: obj.x,
      y: obj.y,
      id: obj.referToBlockId,
      exitBlock: obj.exitBlock,
      infExit: obj.infSetting.type === 'infExit',
      infExitNum: obj.infSetting.type === 'infExit' ? obj.infSetting.level : 0,
      infEnter: obj.infSetting.type === 'infEnter',
      infEnterNum: obj.infSetting.type === 'infEnter' ? obj.infSetting.level : 0,
      infEnterId: obj.infSetting.type === 'infEnter' ? obj.infSetting.enterFromBlockId : -1,
      ...v4.rawPlayerProps(obj.playerSetting),
      flipH: obj.flipH,
      floatInSpace: obj.floatInSpace,
      specialEffect: 0,
    }
  },

  fromLevelFloor(obj: Immutable<LevelFloor>): RawFloor {
    return {
      type: 'Floor',
      x: obj.x,
      y: obj.y,
      floorType: obj.floorType,
    }
  },

  fromLevelWall(obj: Immutable<LevelWall>): RawWall {
    return {
      type: 'Wall',
      x: obj.x,
      y: obj.y,
      ...v4.rawPlayerProps(obj.playerSetting),
    }
  },

  fromLevelBox(obj: Immutable<LevelBox>): RawBlock {
    const { hue, sat, val } = color.blockToRaw(obj.color)

    return {
      type: 'Block',
      x: obj.x,
      y: obj.y,
      id: -1,
      width: 1,
      height: 1,
      hue,
      sat,
      val,
      zoomFactor: 1,
      fillWithWalls: true,
      ...v4.rawPlayerProps(obj.playerSetting),
      flipH: false,
      floatInSpace: false,
      specialEffect: 0,
      children: [],
    }
  },
}

export { v4 }
