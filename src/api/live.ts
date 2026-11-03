import { reloadOnce } from '@/lib/reload'
import { kakaoFindNearby, kakaoSearchPlace } from './kakao'
import { odsayTransitRoutes } from './odsay'
import { safeBrowsingCheck } from './safeBrowsing'
import { mockApi } from './mock'
import type { ExchangeRates, KBuddyApi } from './types'

/** Free, key-less, CORS-enabled daily rates. Falls back to mock if offline. */
async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/KRW')
    const json = (await res.json()) as { result: string; time_last_update_unix: number; rates: Record<string, number> }
    if (json.result !== 'success') throw new Error('rates')
    const krwPer = Object.fromEntries(Object.entries(json.rates).map(([code, perKrw]) => [code, 1 / perKrw]))
    return { updatedAt: new Date(json.time_last_update_unix * 1000).toISOString(), krwPer }
  } catch {
    return mockApi.getExchangeRates()
  }
}

/** Loads the AI module; if this page is older than the latest deploy, its file is gone → reload once. */
const gemini = () =>
  import('./gemini').catch((e) => {
    reloadOnce()
    throw e
  })

/** Real where we have it, mock for the rest. Add real methods here as keys arrive. */
export const liveApi: KBuddyApi = {
  ...mockApi,
  getExchangeRates,
  findNearby: kakaoFindNearby,
  searchPlace: kakaoSearchPlace,
  transitRoutes: odsayTransitRoutes,
  checkLinks: safeBrowsingCheck,
  // Gemini SDK is loaded only when an AI feature is first used (keeps first load light on mobile).
  readText: (...a) => gemini().then((g) => g.geminiReadText(...a)),
  translate: (...a) => gemini().then((g) => g.geminiTranslate(...a)),
  explain: (...a) => gemini().then((g) => g.geminiExplain(...a)),
}
