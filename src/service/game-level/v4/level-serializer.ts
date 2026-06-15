import { DEFAULT_RAW_ATTEMPT_ORDER } from './consts'
import type {
  RawBlock,
  RawBlockChild,
  RawFloor,
  RawLevelHeader,
  RawLevelRoot,
  RawRef,
  RawWall,
} from './raw-types'

function bool(value: boolean): '0' | '1' {
  return value ? '1' : '0'
}

function line(indent: number, ...parts: (string | number)[]) {
  return `${'\t'.repeat(indent)}${parts.join(' ')}`
}

function isDefaultAttemptOrder(attemptOrder: RawLevelHeader['attemptOrder']) {
  return attemptOrder.every((action, index) => action === DEFAULT_RAW_ATTEMPT_ORDER[index])
}

export default class LevelSerializer {
  public static serialize(rawLevel: RawLevelRoot): string {
    const serializer = new LevelSerializer()
    return serializer.serialize(rawLevel)
  }

  public serialize(rawLevel: RawLevelRoot): string {
    return [
      ...this.serializeHeader(rawLevel.header),
      '#',
      ...rawLevel.body.map((block) => this.serializeBlock(block, 0)),
    ].join('\n')
  }

  private serializeHeader(header: RawLevelHeader): string[] {
    const result = [`version ${header.version}`]

    if (!isDefaultAttemptOrder(header.attemptOrder)) {
      result.push(`attempt_order ${header.attemptOrder.join(',')}`)
    }

    if (header.drawStyle) {
      result.push(`draw_style ${header.drawStyle}`)
    }

    if (header.shed) {
      result.push('shed')
    }

    if (header.innerPush) {
      result.push('inner_push')
    }

    if (header.customLevelMusic !== -1) {
      result.push(`custom_level_music ${header.customLevelMusic}`)
    }

    if (header.customLevelPalette !== -1) {
      result.push(`custom_level_palette ${header.customLevelPalette}`)
    }

    return result
  }

  private serializeBlock(block: RawBlock, indent: number): string {
    return [
      line(
        indent,
        'Block',
        block.x,
        block.y,
        block.id,
        block.width,
        block.height,
        block.hue,
        block.sat,
        block.val,
        block.zoomFactor,
        bool(block.fillWithWalls),
        bool(block.player),
        bool(block.possessable),
        block.playerOrder,
        bool(block.flipH),
        bool(block.floatInSpace),
        block.specialEffect,
      ),
      ...block.children.map((child) => this.serializeChild(child, indent + 1)),
    ].join('\n')
  }

  private serializeChild(child: RawBlockChild, indent: number): string {
    switch (child.type) {
      case 'Block':
        return this.serializeBlock(child, indent)
      case 'Ref':
        return this.serializeRef(child, indent)
      case 'Floor':
        return this.serializeFloor(child, indent)
      case 'Wall':
        return this.serializeWall(child, indent)
    }
  }

  private serializeRef(ref: RawRef, indent: number): string {
    return line(
      indent,
      'Ref',
      ref.x,
      ref.y,
      ref.id,
      bool(ref.exitBlock),
      bool(ref.infExit),
      ref.infExitNum,
      bool(ref.infEnter),
      ref.infEnterNum,
      ref.infEnterId,
      bool(ref.player),
      bool(ref.possessable),
      ref.playerOrder,
      bool(ref.flipH),
      bool(ref.floatInSpace),
      ref.specialEffect,
    )
  }

  private serializeFloor(floor: RawFloor, indent: number): string {
    return line(indent, 'Floor', floor.x, floor.y, floor.floorType)
  }

  private serializeWall(wall: RawWall, indent: number): string {
    return line(
      indent,
      'Wall',
      wall.x,
      wall.y,
      bool(wall.player),
      bool(wall.possessable),
      wall.playerOrder,
    )
  }
}
