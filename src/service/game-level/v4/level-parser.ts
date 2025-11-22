import { DEFAULT_RAW_HEADER } from './consts'
import { isRawAttemptOrder } from './enum-check'
import { LevelParserError } from './exception'
import type { RawLevelHeader, RawLevelRoot } from './raw-types'

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
    const { header } = this.parseRawHeader(lineInfos)

    return {
      type: 'Root',
      header,
      body: [],
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

    const resultHeader = { ...DEFAULT_RAW_HEADER }
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

  private checkIndent(line: LineInfo, ...expectedIndent: number[]) {
    if (expectedIndent.includes(line.indent)) return

    this.error(`expecting indentation ${expectedIndent.join(' or ')}, but got ${line.indent}`)
  }

  private checkPropCount(props: string[], expectedPropCount: number) {
    if (props.length !== expectedPropCount)
      this.error(`expecting ${expectedPropCount} properties but got ${props.length} props`)
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

  private resolveHeaderParser(lineType: string): HeaderLineParser {
    switch (lineType) {
      case 'version':
        return (line, header) => {
          header.version = this.parseStringEnumHeader(line.props, '4')
        }
      case 'draw_style':
        return (line, header) => {
          header.drawStyle = this.parseStringEnumHeader(line.props, 'tui', 'grid', 'oldstyle')
        }
      case 'attempt_order':
        return (line, header) => {
          this.checkPropCount(line.props, 1)
          const value = line.props[0]!
          const order = value.split(',')
          if (!isRawAttemptOrder(order)) this.error(`unknown attempt order: ${value}`)
          header.attemptOrder = order
        }
      case 'shed':
        return (line, header) => {
          header.shed = this.parseFlagHeader(line.props)
        }
      case 'inner_push':
        return (line, header) => {
          header.innerPush = this.parseFlagHeader(line.props)
        }
      case 'custom_level_music':
        return (line, header) => {
          header.customLevelMusic = this.parseIntHeader(line.props)
        }
      case 'custom_level_palette':
        return (line, header) => {
          header.customLevelPalette = this.parseIntHeader(line.props)
        }
      default:
        this.error(`unknown header type "${lineType}"`)
    }
  }

  private parseIntHeader(props: string[]) {
    this.checkPropCount(props, 1)
    return this.parseInt(props[0]!)
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

    if (validValues.includes(value as EnumT)) {
      return value as EnumT
    } else {
      this.error(`expecting "${validValues.join('" or "')}", but got "${value}"`)
    }
  }

  private parseInt(rawValue: string) {
    const result = parseInt(rawValue, 10)
    if (isNaN(result)) {
      this.error(`expecting a integer but got ${rawValue}`)
    }
    return result
  }
}

type HeaderLineParser = (line: LineInfo, output: RawLevelHeader) => void
