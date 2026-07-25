export { easyLevel } from './easy'
export { hardLevel } from './hard'
export * from './types'

import { easyLevel } from './easy'
import { hardLevel } from './hard'
import type { Level } from './types'

export type ModeId = Level['id']

export const levels: Record<ModeId, Level> = {
  easy: easyLevel,
  hard: hardLevel,
}
