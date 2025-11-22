import type { RawAttemptOrder, RawLevelHeader } from './raw-types'

export const DEFAULT_RAW_ATTEMPT_ORDER: RawAttemptOrder = ['push', 'enter', 'eat', 'possess']

export const DEFAULT_RAW_HEADER: RawLevelHeader = {
  type: 'Header',
  version: '4',
  attemptOrder: DEFAULT_RAW_ATTEMPT_ORDER,
  shed: false,
  innerPush: false,
  drawStyle: '',
  customLevelMusic: -1,
  customLevelPalette: -1,
}
