import { mockApi } from './mock'
import type { GeoPoint, TransitLeg, TransitRoute } from './types'

const KEY = import.meta.env.VITE_ODSAY_KEY as string | undefined

type OdsaySubPath = {
  trafficType: 1 | 2 | 3
  sectionTime: number
  startName?: string
  endName?: string
  stationCount?: number
  startX?: number
  startY?: number
  endX?: number
  endY?: number
  lane?: { name?: string; busNo?: string }[]
  passStopList?: { stations?: { x: string; y: string }[] }
}
type OdsayPath = { info: { totalTime: number; payment: number; busTransitCount: number; subwayTransitCount: number; totalWalk: number }; subPath: OdsaySubPath[] }
type OdsayResponse = { result?: { path: OdsayPath[] }; error?: { code?: string; msg?: string } | { code?: string; message?: string }[] }

// Basic plan = 30 calls/day → never ask twice for the same trip.
const cache = new Map<string, TransitRoute[] | 'tooClose'>()
const keyOf = (a: GeoPoint, b: GeoPoint) => [a.lat, a.lng, b.lat, b.lng].map((n) => n.toFixed(3)).join(',')

function toLeg(s: OdsaySubPath): TransitLeg {
  const mode = s.trafficType === 1 ? 'subway' : s.trafficType === 2 ? 'bus' : 'walk'
  const lane = s.lane?.[0]
  const line = mode === 'subway' ? lane?.name?.replace(/^수도권\s*/, '') : mode === 'bus' ? lane?.busNo : undefined
  const stations = s.passStopList?.stations?.map((st) => ({ lat: Number(st.y), lng: Number(st.x) })) ?? []
  const ends = s.startX && s.startY && s.endX && s.endY ? [{ lat: s.startY, lng: s.startX }, { lat: s.endY, lng: s.endX }] : []
  const points = stations.length > 1 ? stations : ends
  return { mode, minutes: s.sectionTime, line, from: s.startName, to: s.endName, stops: s.stationCount, points: points.length ? points : undefined }
}

/** Public transit routes via ODsay. Mock only in dev without a key; a failed call (daily limit, network) returns []. */
export async function odsayTransitRoutes(from: GeoPoint, to: GeoPoint): Promise<TransitRoute[] | 'tooClose'> {
  if (!KEY) return mockApi.transitRoutes(from, to)
  const k = keyOf(from, to)
  const hit = cache.get(k)
  if (hit) return hit

  const url =
    `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${from.lng}&SY=${from.lat}&EX=${to.lng}&EY=${to.lat}` +
    `&apiKey=${encodeURIComponent(KEY)}`
  try {
    const json = (await (await fetch(url)).json()) as OdsayResponse
    const err = Array.isArray(json.error) ? json.error[0] : json.error
    if (err) {
      // -98: start and end are within ~700m
      if (String(err.code) === '-98') return cache.set(k, 'tooClose').get(k)!
      return [] // daily limit / unsupported area — the UI says so and offers map apps
    }
    const routes = (json.result?.path ?? [])
      .slice(0, 3)
      .map((p) => ({
        minutes: p.info.totalTime,
        fare: p.info.payment,
        transfers: Math.max(0, p.info.busTransitCount + p.info.subwayTransitCount - 1),
        walkM: p.info.totalWalk,
        legs: p.subPath.filter((s) => s.sectionTime > 0).map(toLeg),
      }))
    cache.set(k, routes)
    return routes
  } catch {
    return []
  }
}
