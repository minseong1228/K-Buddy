import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KoreanCard } from '@/components/KoreanCard'
import { RouteMap } from '@/components/RouteMap'
import { api, type FoundPlace, type GeoPoint, type TransitRoute } from '@/api'
import { useAsync } from '@/hooks/useAsync'
import { roadKm, taxiFare } from '@/data/move'
import { M } from '@/i18n/messages'
import { getPosition } from '@/lib/kakao'
import { mapLinks, openAppOr } from '@/lib/mapLinks'
import { useT } from '@/lib/i18n'
import { END_COLOR, START_COLOR, legColor } from '@/lib/lineColors'
import { fmt } from '@/lib/profile'

/** The trip as a friendly vertical timeline: start → walk → ride (line color) → … → arrive. */
function RouteSteps({ route, destName }: { route: TransitRoute; destName: string }) {
  const { t } = useT()
  return (
    <ol className="route-steps">
      <li className="route-step">
        <span className="route-dot" style={{ background: START_COLOR }}>🙂</span>
        <span className="pt-1.5 font-semibold">{t(M.myLocation)}</span>
      </li>
      {route.legs.map((l, i) =>
        l.mode === 'walk' ? (
          <li key={i} className="route-step">
            <span className="route-dot" data-walk="true">🚶</span>
            <span className="pt-1.5 text-muted-foreground">{fmt(t(M.walkFor), { n: String(l.minutes) })}</span>
          </li>
        ) : (
          <li key={i} className="route-step">
            <span className="route-dot" style={{ background: legColor(l) }}>{l.mode === 'bus' ? '🚌' : '🚇'}</span>
            <span className="flex min-w-0 flex-col gap-0.5 pt-1">
              <span>
                <span className="line-chip" style={{ background: legColor(l) }}>{l.line}</span> <b>{l.from}</b> → {l.to}
              </span>
              <span className="text-sm text-muted-foreground">{fmt(t(M.rideInfo), { stops: String(l.stops ?? '?'), min: String(l.minutes) })}</span>
              <span className="text-sm font-semibold">⬇️ {fmt(t(M.getOffAt), { stop: l.to ?? '' })}</span>
            </span>
          </li>
        ),
      )}
      <li className="route-step">
        <span className="route-dot" style={{ background: END_COLOR }}>🏁</span>
        <span className="pt-1.5 font-semibold">{destName}</span>
      </li>
    </ol>
  )
}

/** One tap to see the same route in the map app people already use. */
function MapAppButtons({ from, to }: { from: GeoPoint; to: FoundPlace }) {
  const { t } = useT()
  const links = mapLinks(from, to)
  return (
    <div className="flex flex-col gap-2">
      <p className="section-label">{t(M.openIn)}</p>
      <div className="grid grid-cols-3 gap-2">
        <a className="app-tile aspect-auto py-3" href={links.kakao} target="_blank" rel="noreferrer">
          <span className="text-2xl">🟡</span>
          <span className="app-tile-label">KakaoMap</span>
        </a>
        <button className="app-tile aspect-auto py-3" onClick={() => openAppOr(links.naverApp, links.naverWeb)}>
          <span className="text-2xl">🟢</span>
          <span className="app-tile-label">Naver Map</span>
        </button>
        <a className="app-tile aspect-auto py-3" href={links.google} target="_blank" rel="noreferrer">
          <span className="text-2xl">🔵</span>
          <span className="app-tile-label">Google Maps</span>
        </a>
      </div>
    </div>
  )
}

/** Everything for one destination: route drawn on a map, step-by-step timeline, map apps, taxi, a card for the driver. */
export function RouteResult({ here, dest }: { here: GeoPoint; dest: FoundPlace }) {
  const { t } = useT()
  const { data: routes, loading } = useAsync(() => api.transitRoutes(here, dest), `${dest.id}`)
  const [pick, setPick] = useState(0)
  const km = roadKm(here, dest)
  const list = Array.isArray(routes) ? routes : []
  const route = list[pick] ?? list[0]
  const icon = (r: TransitRoute) => [...new Set(r.legs.filter((l) => l.mode !== 'walk').map((l) => (l.mode === 'bus' ? '🚌' : '🚇')))].join('') || '🚶'

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-semibold">📍 {dest.name}</p>
      {route && (
        <p className="route-summary">
          {icon(route)} {fmt(t(M.routeSummary), { min: String(route.minutes), fare: route.fare.toLocaleString(), n: String(route.transfers) })}
        </p>
      )}
      {list.length > 1 && (
        <div className="chip-row">
          {list.map((r, i) => (
            <button key={i} className="chip" data-active={i === pick} onClick={() => setPick(i)}>
              {icon(r)} {r.minutes}
              {t(M.min)} · ₩{r.fare.toLocaleString()}
            </button>
          ))}
        </div>
      )}
      <RouteMap from={here} to={dest} toName={dest.name} startLabel={t(M.myLocation)} route={route} />
      {loading && <p className="text-muted-foreground">{t(M.loading)}</p>}
      {routes === 'tooClose' ? (
        <p className="info-row text-base">{t(M.tooClose)}</p>
      ) : routes?.length === 0 ? (
        <p className="info-row text-base">ℹ️ {t(M.routeUnavailable)}</p>
      ) : (
        route && <RouteSteps route={route} destName={dest.name} />
      )}
      <MapAppButtons from={here} to={dest} />
      <div className="info-row items-center text-base">
        <span className="text-2xl">🚕</span>
        <span>
          {t(M.taxiInstead)}: ~₩{taxiFare(km).toLocaleString()} · ~{Math.round(5 + km * 2.5)} {t(M.min)}
        </span>
      </div>
      <p className="section-label">{t(M.showDriver)}</p>
      <KoreanCard ko={`${dest.address} ${dest.name}까지 가 주세요.`} />
    </div>
  )
}

/** Where to? → pick place (Kakao) → subway/bus routes (ODsay) + taxi estimate + a card for the driver. */
export function RouteFinder() {
  const { t } = useT()
  const [query, setQuery] = useState('')
  const [here, setHere] = useState<GeoPoint | null>(null)
  const [places, setPlaces] = useState<FoundPlace[] | null>(null)
  const [dest, setDest] = useState<FoundPlace | null>(null)
  const [busy, setBusy] = useState(false)

  const search = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setBusy(true)
    setDest(null)
    const pos = here ?? (await getPosition())
    setHere(pos)
    setPlaces(await api.searchPlace(query.trim(), pos))
    setBusy(false)
  }

  const choose = (p: FoundPlace) => {
    setDest(p)
    setPlaces(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🗺️ {t(M.routeTitle)}</CardTitle>
        <CardDescription>{t(M.routeDesc)}</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <form className="flex gap-2" onSubmit={search}>
          <input
            className="h-12 min-w-0 flex-1 rounded-xl border bg-card px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder={t(M.wherePh)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="search"
          />
          <Button type="submit" className="h-12 px-4" disabled={busy}>
            <Search /> {t(M.searchBtn)}
          </Button>
        </form>

        {busy && <p className="text-muted-foreground">{t(M.loading)}</p>}

        {places && (
          <div className="flex flex-col gap-2">
            {places.length ? <p className="section-label">{t(M.pickPlace)}</p> : <p className="text-muted-foreground">{t(M.noPlace)}</p>}
            {places.map((p, i) => (
              <button key={p.id} className="phrase-row pop-in" style={{ animationDelay: `${i * 50}ms` }} onClick={() => choose(p)}>
                <span className="text-xl">📍</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{p.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.address}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {dest && here && <RouteResult here={here} dest={dest} />}
      </CardContent>
    </Card>
  )
}
