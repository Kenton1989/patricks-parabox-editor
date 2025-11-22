export class LevelParserError extends Error {
  constructor(lineNo: number, errorMessage: string) {
    super(`line ${lineNo}: ${errorMessage}`)
  }
}
