import { mockApi } from './mock'
import type { FoundPlace, GeoPoint, Place, PlaceKind } from './types'
import { getPosition, loadKakao, searchKeyword, searchNearby } from '@/lib/kakao'

/** Kakao keyword per place kind. WeChat/Alipay acceptance isn't in Kakao data → mock. */
const QUERY: Partial<Record<PlaceKind, { q: string; fallback?: string; note: Place['note'] }>> = {
  atm: { q: '글로벌ATM', fallback: '은행 ATM', note: { en: 'Check for the "Global ATM" sign', ko: '"글로벌 ATM" 표시 확인', zh: '确认有“Global ATM”标志' } },
  halal: { q: '할랄', fallback: '이슬람 음식', note: { en: 'Ask about certification', ko: '인증 여부 확인', zh: '请确认是否有认证' } },
}

/** Real nearby search with Kakao Local (via JS SDK). Falls back to mock data if Kakao is unavailable. */
export async function kakaoFindNearby(kind: PlaceKind, pos?: { lat: number; lng: number }): Promise<Place[]> {
  const spec = QUERY[kind]
  const maps = spec ? await loadKakao() : null
  if (!spec || !maps) return mockApi.findNearby(kind)
  const at = pos ?? (await getPosition())
  let found = await searchNearby(maps, spec.q, at)
  if (!found.length && spec.fallback) found = await searchNearby(maps, spec.fallback, at)
  // Domain not registered / nothing found → show demo data (the UI marks it).
  if (!found.length) return mockApi.findNearby(kind)
  return found.map((p) => ({
    id: p.id,
    kind,
    name: p.place_name,
    nameKo: p.road_address_name || p.address_name,
    distanceM: Number(p.distance) || 0,
    note: spec.note,
    lat: Number(p.y),
    lng: Number(p.x),
    url: p.place_url,
  }))
}

/** Destination search with Kakao. Falls back to mock if Kakao is unavailable. */
export async function kakaoSearchPlace(query: string, near?: GeoPoint): Promise<FoundPlace[]> {
  const maps = await loadKakao()
  if (!maps) return mockApi.searchPlace(query, near)
  const found = await searchKeyword(maps, query, near)
  return found.map((p) => ({ id: p.id, name: p.place_name, address: p.road_address_name || p.address_name, lat: Number(p.y), lng: Number(p.x) }))
}
