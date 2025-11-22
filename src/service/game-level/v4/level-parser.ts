import { createDefaultRawHeader } from './consts'
import { isRawAttemptOrder } from './enum-check'
import { LevelParserError } from './exception'
import type {
  RawBlock,
  RawBlockChild,
  RawFloor,
  RawLevelHeader,
  RawLevelRoot,
  RawRef,
  RawWall,
} from './raw-types'

type LineInfo = {
  lineNo: number
  indent: number
  type: string
  props: string[]
  rawLine?: string
}

const TYPE_EMPTY_LINE = ''
const TYPE_END_HEADER = '#'
const NOT_TAB = /[^\t]/
const WHITESPACES = /\s+/

export default class LevelParser {
  public static parse(rawLevel: string): RawLevelRoot {
    const parser = new LevelParser()
    return parser.parse(rawLevel)
  }

  public parse(rawLevel: string): RawLevelRoot {
    const lines = rawLevel.split('\n')
    const lineInfos = lines.map(this.preProcessLine).filter((m) => m.type !== TYPE_EMPTY_LINE)
    const { header, bodyLinesIter } = this.parseRawHeader(lineInfos)
    const body = this.parseRawBody(bodyLinesIter)

    return {
      type: 'Root',
      header,
      body,
    }
  }

  private lastReadLineNo = 0
  private readLine(iter: ArrayIterator<LineInfo>) {
    const result = iter.next()
    if (!result.done) {
      this.lastReadLineNo = result.value.lineNo
    }
    return result
  }

  private error(message: string, lineNo?: number): never {
    lineNo ??= this.lastReadLineNo
    throw new LevelParserError(lineNo, message)
  }

  private preProcessLine(line: string, index: number): LineInfo {
    const indent = line.search(NOT_TAB)
    const [type, ...props] = line.trim().split(WHITESPACES)
    return {
      lineNo: index + 1,
      indent,
      type: type ?? '',
      props,
      rawLine: line,
    }
  }

  private parseRawHeader(lines: LineInfo[]): {
    header: RawLevelHeader
    bodyLinesIter: ArrayIterator<LineInfo>
  } {
    const inputIter = lines.values()

    const resultHeader = { ...createDefaultRawHeader() }
    let current = this.readLine(inputIter)
    this.checkFirstHeader(current.value)

    let headerEnded = false
    while (!current.done) {
      const line = current.value

      this.checkIndent(line, 0)

      if (line.type === TYPE_END_HEADER) {
        headerEnded = true
        break
      }

      const parseHeader = this.resolveHeaderParser(line.type)
      parseHeader(line, resultHeader)

      current = this.readLine(inputIter)
    }

    if (!headerEnded) {
      this.error('unexpected end of file')
    }

    return {
      header: resultHeader,
      bodyLinesIter: inputIter,
    }
  }

  private parseRawBody(inputIter: ArrayIterator<LineInfo>): RawBlock[] {
    let current = this.readLine(inputIter)
    if (current.done) return []

    const result: RawBlock[] = []
    // first line of body must have not indentation
    this.checkIndent(current.value, 0)

    let lastBlock = {} as RawBlock
    while (!current.done) {
      const line = current.value

      this.checkIndent(line, 0, 1)

      if (line.indent == 0) {
        const block = this.parseRowBlock(line)
        lastBlock = block
        result.push(block)

        current = this.readLine(inputIter)
      } else {
        const { children, lastUnprocessedResult } = this.parseBlockChildren(line, inputIter)
        lastBlock.children = children

        current = lastUnprocessedResult
      }
    }
    return result
  }

  private parseRowBlock(line: LineInfo): RawBlock {
    this.checkType(line.type, 'Block')
    this.checkPropCount(line.props, 16)

    const read = this.createLinePropReader(line)

    return {
      type: 'Block',
      x: read.int(0),
      y: read.int(1),
      id: read.int(2),
      width: read.int(3),
      height: read.int(4),
      hue: read.float(5),
      sat: read.float(6),
      val: read.float(7),
      zoomFactor: read.float(8),
      fillWithWalls: read.bool(9),
      player: read.bool(10),
      playerOrder: read.int(11),
      possessable: read.bool(12),
      flipH: read.bool(13),
      floatInSpace: read.bool(14),
      specialEffect: read.int(15),
      children: [],
    }
  }

  private parseRawRef(line: LineInfo): RawRef {
    this.checkType(line.type, 'Ref')
    this.checkPropCount(line.props, 15)

    const read = this.createLinePropReader(line)

    return {
      type: 'Ref',
      x: read.int(0),
      y: read.int(1),
      id: read.int(2),
      exitBlock: read.bool(3),
      infExit: read.bool(4),
      infExitNum: read.int(5),
      infEnter: read.bool(6),
      infEnterNum: read.int(7),
      infEnterId: read.int(8),
      player: read.bool(9),
      possessable: read.bool(10),
      playerOrder: read.int(11),
      flipH: read.bool(12),
      floatInSpace: read.bool(13),
      specialEffect: read.int(14),
    }
  }

  private parseRawWall(line: LineInfo): RawWall {
    this.checkType(line.type, 'Wall')
    this.checkPropCount(line.props, 5)

    const read = this.createLinePropReader(line)

    return {
      type: 'Wall',
      x: read.int(0),
      y: read.int(1),
      player: read.bool(2),
      possessable: read.bool(3),
      playerOrder: read.int(4),
    }
  }

  private parseRawFloor(line: LineInfo): RawFloor {
    this.checkType(line.type, 'Floor')
    this.checkPropCount(line.props, 3)

    const read = this.createLinePropReader(line)

    return {
      type: 'Floor',
      x: read.int(0),
      y: read.int(1),
      floorType: this.parseStringEnumProp(line.props[2]!, 'PlayerButton', 'Button'),
    }
  }

  private parseRawBlockChild(line: LineInfo): RawBlockChild {
    this.checkType(line.type, 'Block', 'Floor', 'Ref', 'Wall')

    switch (line.type) {
      case 'Block':
        return this.parseRowBlock(line)
      case 'Floor':
        return this.parseRawFloor(line)
      case 'Ref':
        return this.parseRawRef(line)
      case 'Wall':
        return this.parseRawWall(line)
      default:
        this.error(`unknown block child type: ${line.type}`)
    }
  }

  private parseBlockChildren(
    firstLine: LineInfo,
    remainingLineIter: ArrayIterator<LineInfo>,
  ): { children: RawBlockChild[]; lastUnprocessedResult: IteratorResult<LineInfo, undefined> } {
    const baseIndent = firstLine.indent

    const result: RawBlockChild[] = []

    let current: IteratorResult<LineInfo, undefined> = { value: firstLine, done: false }
    let lastChild: RawBlockChild = {} as RawBlockChild

    while (!current.done) {
      const line = current.value
      if (line.indent < baseIndent) break

      this.checkIndent(line, baseIndent, baseIndent + 1)

      if (line.indent === baseIndent) {
        const child = this.parseRawBlockChild(line)
        result.push(child)

        lastChild = child
        current = remainingLineIter.next()
      } else {
        if (lastChild.type === 'Block') {
          const { lastUnprocessedResult, children } = this.parseBlockChildren(
            line,
            remainingLineIter,
          )

          lastChild.children = children
          current = lastUnprocessedResult
        } else {
          this.error(`only Block can have children, ${lastChild.type} cannot have`)
        }
      }
    }

    return {
      children: result,
      lastUnprocessedResult: current,
    }
  }

  private createLinePropReader(line: LineInfo): {
    int: (index: number) => number
    bool: (index: number) => boolean
    float: (index: number) => number
  } {
    return {
      int: (i) => this.parseIntProp(line.props[i]!),
      bool: (i) => this.parseBoolProp(line.props[i]!),
      float: (i) => this.parseFloatProp(line.props[i]!),
    }
  }

  private checkIndent(line: LineInfo, ...expectedIndent: number[]) {
    if (expectedIndent.includes(line.indent)) return

    this.error(`expecting indentation ${expectedIndent.join(' or ')}, but got ${line.indent}`)
  }

  private checkPropCount(props: string[], expectedPropCount: number) {
    if (props.length !== expectedPropCount)
      this.error(`expecting ${expectedPropCount} properties but got ${props.length} properties`)
  }

  private checkFirstHeader(line: LineInfo | undefined) {
    if (!line) {
      this.error('failed to find level header')
    }

    if (line.lineNo !== 1) {
      this.error(`expecting header to starts from line 1 but started from line ${line.lineNo}`)
    }

    if (line.type === TYPE_EMPTY_LINE) {
      this.error(`expecting the first header to be "version" but got empty line`)
    }

    if (line.type !== 'version') {
      this.error(`expecting the first header to be "version" but got "${line.type}"`)
    }
  }

  private checkType(type: string, ...expectedTypes: RawBlockChild['type'][]) {
    if (expectedTypes.includes(type as RawBlockChild['type'])) {
      return
    }

    this.error(`expecting block type "${expectedTypes.join('" or "')}", but got "${type}"`)
  }

  private resolveHeaderParser(lineType: string): HeaderLineParser {
    switch (lineType) {
      case 'version':
        return (line, output) => {
          output.version = this.parseStringEnumHeader(line.props, '4')
        }
      case 'draw_style':
        return (line, output) => {
          output.drawStyle = this.parseStringEnumHeader(line.props, 'tui', 'grid', 'oldstyle')
        }
      case 'attempt_order':
        return (line, output) => {
          this.checkPropCount(line.props, 1)
          const value = line.props[0]!
          const order = value.split(',')
          if (!isRawAttemptOrder(order)) this.error(`unknown attempt order: ${value}`)
          output.attemptOrder = order
        }
      case 'shed':
        return (line, output) => {
          output.shed = this.parseFlagHeader(line.props)
        }
      case 'inner_push':
        return (line, output) => {
          output.innerPush = this.parseFlagHeader(line.props)
        }
      case 'custom_level_music':
        return (line, output) => {
          output.customLevelMusic = this.parseIntHeader(line.props)
        }
      case 'custom_level_palette':
        return (line, output) => {
          output.customLevelPalette = this.parseIntHeader(line.props)
        }
      default:
        this.error(`unknown header type "${lineType}"`)
    }
  }

  private parseIntHeader(props: string[]) {
    this.checkPropCount(props, 1)
    return this.parseIntProp(props[0]!)
  }

  private parseFlagHeader(props: string[]) {
    this.checkPropCount(props, 0)
    return true
  }

  private parseStringEnumHeader<EnumT extends string>(
    props: string[],
    ...validValues: EnumT[]
  ): EnumT {
    this.checkPropCount(props, 1)
    const value = props[0]!
    return this.parseStringEnumProp(value, ...validValues)
  }

  private parseIntProp(rawValue: string) {
    const result = parseInt(rawValue, 10)
    if (isNaN(result)) {
      this.error(`expecting a integer but got "${rawValue}"`)
    }
    return result
  }

  private parseBoolProp(rawValue: string) {
    switch (rawValue) {
      case '0':
        return false
      case '1':
        return true
      default:
        this.error(`expecting "0" or "1" but got "${rawValue}"`)
    }
  }

  private parseFloatProp(rawValue: string): number {
    const result = parseFloat(rawValue)
    if (isNaN(result)) {
      this.error(`expecting a decimal number but got "${rawValue}"`)
    }
    return result
  }

  private parseStringEnumProp<EnumT extends string>(
    rawValue: string,
    ...validValues: EnumT[]
  ): EnumT {
    if (validValues.includes(rawValue as EnumT)) {
      return rawValue as EnumT
    } else {
      this.error(`expecting "${validValues.join('" or "')}" but got "${rawValue}"`)
    }
  }
}

type HeaderLineParser = (line: LineInfo, output: RawLevelHeader) => void
