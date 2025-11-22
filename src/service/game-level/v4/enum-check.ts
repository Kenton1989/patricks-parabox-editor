import { type RawAttemptAction, type RawAttemptOrder, type RawDrawStyle } from './raw-types'

const RAW_ATTEMPT_ACTIONS = new Set<string>(['push', 'enter', 'eat', 'possess'])

export function isRawAttemptAction(s: string): s is RawAttemptAction {
  return RAW_ATTEMPT_ACTIONS.has(s)
}

export function isRawAttemptOrder(list: string[]): list is RawAttemptOrder {
  if (list.length !== 4) return false

  const valSet = new Set(list)
  if (valSet.size !== 4) return false

  for (const s of valSet) {
    if (!isRawAttemptAction(s)) return false
  }

  return true
}

export const RAW_DRAW_STYLES = ['', 'tui', 'grid', 'oldstyle']
const DRAW_STYLES_SET = new Set(RAW_DRAW_STYLES)
export function isRawDrawStyle(s: string): s is RawDrawStyle {
  return DRAW_STYLES_SET.has(s)
}
