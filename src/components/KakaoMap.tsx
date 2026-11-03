import { useEffect, useRef, useState } from 'react'
import type { Place } from '@/api'
import { loadKakao } from '@/lib/kakao'

/** Small Kakao map with a marker per place. Renders nothing if Kakao isn't available. */
export function KakaoMap({ places }: { places: Place[] }) {
  const el = useRef<HTMLDivElement>(null)
  const hasPins = places.some((p) => p.lat && p.lng)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const pins = places.filter((p) => p.lat && p.lng)
    if (!pins.length) return
    let alive = true
    loadKakao().then((maps) => {
      if (!alive) return
      if (!maps || !el.current) return setFailed(true)
      const map = new maps.Map(el.current, { center: new maps.LatLng(pins[0].lat!, pins[0].lng!), level: 5 })
      for (const p of pins) new maps.Marker({ map, position: new maps.LatLng(p.lat!, p.lng!), title: p.name })
    })
    return () => {
      alive = false
    }
  }, [places])

  if (!hasPins || failed) return null
  return <div ref={el} className="h-48 w-full overflow-hidden rounded-xl border bg-muted" />
}
