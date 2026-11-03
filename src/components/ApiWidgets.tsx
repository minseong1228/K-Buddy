import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, MapPin, RotateCcw, Sparkles, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KakaoMap } from '@/components/KakaoMap'
import { RouteResult } from '@/components/RouteFinder'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { getPosition } from '@/lib/kakao'
import { api, type Explanation, type GeoPoint, type OcrKind, type Place, type PlaceKind } from '@/api'
import { useAi } from '@/hooks/useAi'
import { useAsync } from '@/hooks/useAsync'
import { M } from '@/i18n/messages'
import { speakKorean } from '@/lib/speech'
import { useT } from '@/lib/i18n'

/** Marks UI that runs on mock data until the real API is connected. */
export function DemoBadge() {
  const { t } = useT()
  return <span className="api-badge">{t(M.demoData)}</span>
}

/** Marks UI powered by Gemini (needs the user's key). */
export function AiBadge() {
  return (
    <span className="api-badge border-primary text-primary">
      <Sparkles className="mr-0.5 size-3" /> AI
    </span>
  )
}

/**
 * Camera / gallery button → Gemini reads the Korean text.
 * Shows the photo right away with a spinner, and a clear retry if reading fails.
 */
export function PhotoButton({ kind, onText }: { kind: OcrKind; onText: (text: string) => void }) {
  const { t } = useT()
  const input = useRef<HTMLInputElement>(null)
  const { run, busy } = useAi()
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo.url)
    },
    [photo],
  )

  const read = async (file: File) => {
    setFailed(false)
    const text = await run(() => api.readText(file, kind))
    if (text?.trim()) onText(text.trim())
    else setFailed(true)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" className="big-btn h-14 w-full text-lg" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? <Loader2 className="animate-spin" /> : <Camera />} {busy ? t(M.reading) : t(M.takePhoto)} <AiBadge />
      </Button>
      {photo && (
        <div className="pop-in relative overflow-hidden rounded-xl border">
          <img src={photo.url} alt="" className="max-h-56 w-full object-cover" />
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 text-base font-semibold">
              <Loader2 className="animate-spin" /> {t(M.reading)}
            </div>
          )}
        </div>
      )}
      {failed && photo && !busy && (
        <div className="status-warn flex items-center gap-2 rounded-xl p-3 text-sm">
          <span className="flex-1">{t(M.photoFail)}</span>
          <Button size="sm" variant="outline" onClick={() => read(photo.file)}>
            <RotateCcw /> {t(M.retry)}
          </Button>
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          setPhoto({ file, url: URL.createObjectURL(file) })
          void read(file)
        }}
      />
    </div>
  )
}

/** Nearby places (map + list). Tap a place → its route opens right here. Mock data is marked with a badge. */
export function NearbyList({ kind, title }: { kind: PlaceKind; title: string }) {
  const { t } = useT()
  const { data, loading } = useAsync(() => api.findNearby(kind), kind)
  const isReal = !!data?.some((p) => p.url)
  const [route, setRoute] = useState<{ here: GeoPoint | null; place: Place } | null>(null)

  const open = async (place: Place) => {
    setRoute({ here: null, place })
    const here = await getPosition()
    setRoute((r) => (r?.place.id === place.id ? { here, place } : r))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="section-label">{title}</p>
        {data && !isReal && <DemoBadge />}
      </div>
      {loading && <p className="text-sm text-muted-foreground">{t(M.loading)}</p>}
      {data && <KakaoMap places={data} />}
      {data?.map((p) => (
        <button key={p.id} className="phrase-row" onClick={() => open(p)} disabled={!p.lat}>
          <MapPin className="size-5 shrink-0 text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{p.name}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {p.nameKo} · {t(p.note)}
            </span>
          </span>
          <span className="flex flex-col items-end">
            <span className="text-sm font-semibold tabular-nums">{p.distanceM < 1000 ? `${p.distanceM}m` : `${(p.distanceM / 1000).toFixed(1)}km`}</span>
            <span className="text-xs font-semibold text-primary">{t(M.route)} ›</span>
          </span>
        </button>
      ))}
      <Dialog open={!!route} onOpenChange={(o) => !o && setRoute(null)}>
        <DialogContent>
          <DialogTitle className="sr-only">{route?.place.name}</DialogTitle>
          {route && !route.here && <p className="py-6 text-center text-muted-foreground">📍 {t(M.locating)}</p>}
          {route?.here && (
            <RouteResult
              here={route.here}
              dest={{ id: route.place.id, name: route.place.name, address: route.place.nameKo, lat: route.place.lat!, lng: route.place.lng! }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** "Ask AI" button + the explanation card it produces. */
export function AiExplain({ busy, result, onAsk }: { busy: boolean; result: Explanation | null; onAsk: () => void }) {
  const { t } = useT()
  const pill = result && { safe: M.ok, warn: M.maybe, danger: M.avoid }[result.verdict]
  return (
    <div className="flex flex-col gap-3">
      <Button className="big-btn w-full" disabled={busy} onClick={onAsk}>
        <Sparkles /> {busy ? t(M.aiThinking) : t(M.askAi)}
      </Button>
      {result && (
        <div className="pop-in flex flex-col gap-2 rounded-xl border-2 border-primary/30 bg-secondary/50 p-4">
          {pill && result.replies.length === 0 && <span className={`status-pill status-${result.verdict}`}>{t(pill)}</span>}
          <p className="text-lg font-semibold">{result.summary}</p>
          {result.points.length > 0 && (
            <ul className="flex flex-col gap-1">
              {result.points.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          )}
          {result.replies.length > 0 && (
            <div className="chip-row">
              {result.replies.map((r) => (
                <button key={r.ko} className="chip" onClick={() => speakKorean(r.ko)}>
                  <Volume2 className="size-4" /> {r.ko} <span className="text-muted-foreground">{r.meaning}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
