import type { Lang, Tx } from '@/lib/i18n'

/**
 * Contract every backend (mock or real) must follow.
 * UI code imports only `api` from '@/api' — never a concrete implementation.
 * See docs/API.md for which real service each method maps to.
 */
export type PlaceKind = 'atm' | 'halal' | 'wechat' | 'alipay'

export type Place = {
  id: string
  kind: PlaceKind
  name: string
  nameKo: string
  distanceM: number
  note: Tx
  lat?: number
  lng?: number
  /** Opens the place in Kakao Map */
  url?: string
}

export type ExchangeRates = {
  /** ISO time the rates were published */
  updatedAt: string
  /** KRW per 1 unit of each currency */
  krwPer: Record<string, number>
}

export type GeoPoint = { lat: number; lng: number }

export type FoundPlace = { id: string; name: string; address: string; lat: number; lng: number }

/** One part of a trip. `points` = stop coordinates in riding order (subway/bus), used to draw the route. */
export type TransitLeg = { mode: 'subway' | 'bus' | 'walk'; minutes: number; line?: string; from?: string; to?: string; stops?: number; points?: GeoPoint[] }

export type TransitRoute = { minutes: number; fare: number; transfers: number; walkM: number; legs: TransitLeg[] }

export type OcrKind = 'label' | 'ad' | 'message'

/** One link checked against Google Safe Browsing; threat is e.g. 'SOCIAL_ENGINEERING' or null when clean. */
export type LinkCheck = { url: string; threat: string | null }

export type ExplainKind = 'label' | 'ad' | 'staff' | 'situation' | 'scam'

/** AI explanation, written in the user's language. */
export type Explanation = {
  verdict: 'safe' | 'warn' | 'danger'
  summary: string
  points: string[]
  /** 'staff': replies to say back. 'situation': Korean sentences to show staff. Empty otherwise */
  replies: { ko: string; meaning: string }[]
}

export interface KBuddyApi {
  /** Real: 한국수출입은행 현재환율 API */
  getExchangeRates(): Promise<ExchangeRates>
  /** Real: Kakao Local / 한국관광공사 TourAPI (무슬림 친화 식당) */
  findNearby(kind: PlaceKind, pos?: GeoPoint): Promise<Place[]>
  /** Real: Kakao Map keyword search — destination lookup */
  searchPlace(query: string, near?: GeoPoint): Promise<FoundPlace[]>
  /** Real: ODsay public transit (Basic plan: 30 calls/day, cached). 'tooClose' = under ~700m, just walk */
  transitRoutes(from: GeoPoint, to: GeoPoint): Promise<TransitRoute[] | 'tooClose'>
  /** Google Safe Browsing: are these links known-dangerous? null = check unavailable */
  checkLinks(urls: string[]): Promise<LinkCheck[] | null>
  /** Gemini (BYOK): photo → Korean text */
  readText(image: File, kind: OcrKind): Promise<string>
  /** Gemini (BYOK): free text translation; to 'ko' gives a polite sentence to show staff */
  translate(text: string, from: Lang, to: Lang): Promise<string>
  /** Gemini (BYOK): explain a label / ad / what staff said, for this user's language and food rule */
  explain(kind: ExplainKind, text: string, lang: Lang, dietName?: string): Promise<Explanation>
}
