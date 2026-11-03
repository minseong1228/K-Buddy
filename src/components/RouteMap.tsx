import { useEffect, useRef, useState } from 'react'
import type { GeoPoint, TransitRoute } from '@/api'
import { loadKakao, type KakaoShape } from '@/lib/kakao'
import { END_COLOR, START_COLOR, WALK_COLOR, legColor } from '@/lib/lineColors'

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** Small rounded label drawn on the map (Kakao overlays take HTML strings). */
const tag = (label: string, bg: string) =>
  `<div style="transform:translateY(-4px);background:${bg};color:#fff;font:700 13px/1.25 system-ui,sans-serif;padding:5px 10px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,.3);white-space:nowrap">${esc(label)}</div>`

/**
 * The trip drawn on a Kakao map: walking parts dashed grey, each subway/bus ride in its real line color,
 * labels where you board, plus start and finish. Renders nothing if the map can't load.
 */
export function RouteMap({ from, to, toName, startLabel, route }: { from: GeoPoint; to: GeoPoint; toName: string; startLabel: string; route?: TransitRoute }) {
  const el = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    const shapes: KakaoShape[] = []
    loadKakao().then((maps) => {
      if (!alive) return
      if (!maps || !el.current) return setFailed(true)
      const ll = (p: GeoPoint) => new maps.LatLng(p.lat, p.lng)
      const map = new maps.Map(el.current, { center: ll(from), level: 6 })
      const legs = route?.legs ?? []

      let prev = from
      legs.forEach((leg, i) => {
        if (leg.mode === 'walk' || !leg.points?.length) {
          const end = legs.slice(i + 1).find((l) => l.points?.length)?.points?.[0] ?? to
          shapes.push(new maps.Polyline({ map, path: [ll(prev), ll(end)], strokeWeight: 4, strokeColor: WALK_COLOR, strokeOpacity: 0.9, strokeStyle: 'shortdash' }))
          prev = end
          return
        }
        const color = legColor(leg)
        shapes.push(new maps.Polyline({ map, path: leg.points.map(ll), strokeWeight: 7, strokeColor: color, strokeOpacity: 0.95 }))
        shapes.push(new maps.CustomOverlay({ map, position: ll(leg.points[0]), content: tag(`${leg.mode === 'bus' ? '🚌' : '🚇'} ${leg.line ?? ''}`, color), yAnchor: 1, zIndex: 2 }))
        prev = leg.points[leg.points.length - 1]
      })
      if (!legs.length) shapes.push(new maps.Polyline({ map, path: [ll(from), ll(to)], strokeWeight: 4, strokeColor: WALK_COLOR, strokeOpacity: 0.9, strokeStyle: 'shortdash' }))
      shapes.push(new maps.CustomOverlay({ map, position: ll(from), content: tag(`🙂 ${startLabel}`, START_COLOR), yAnchor: 1, zIndex: 3 }))
      shapes.push(new maps.CustomOverlay({ map, position: ll(to), content: tag(`🏁 ${toName}`, END_COLOR), yAnchor: 1, zIndex: 3 }))

      const fit = () => {
        const bounds = new maps.LatLngBounds()
        for (const p of [from, to, ...legs.flatMap((l) => l.points ?? [])]) bounds.extend(ll(p))
        map.setBounds(bounds, 48, 32, 24, 32)
      }
      fit()
      // Inside an opening dialog the box can still be resizing — fit again once it settles
      setTimeout(() => {
        if (!alive) return
        map.relayout()
        fit()
      }, 350)
    })
    return () => {
      alive = false
      shapes.forEach((s) => s.setMap(null))
    }
  }, [from, to, toName, startLabel, route])

  if (failed) return null
  return <div ref={el} className="route-map" />
}
