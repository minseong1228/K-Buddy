import { liveApi } from './live'
import type { KBuddyApi } from './types'

/** Real APIs where available (see live.ts), mock for the rest. */
export const api: KBuddyApi = liveApi

export type * from './types'
