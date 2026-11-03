import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KoreanCard } from '@/components/KoreanCard'
import { PageIntro } from '@/components/Mascot'
import { RouteFinder } from '@/components/RouteFinder'
import { ETIQUETTE, SAFETY_TIPS, STEEP_SPOTS, planTrip } from '@/data/move'
import { M } from '@/i18n/messages'
import { useT } from '@/lib/i18n'

function TripPlanner() {
  const { t } = useT()
  const [km, setKm] = useState(5)
  const [people, setPeople] = useState(1)
  const [luggage, setLuggage] = useState(false)
  const [night, setNight] = useState(false)
  const [mobility, setMobility] = useState(false)
  const results = planTrip({ km, people, luggage, night, mobility })

  return (
    <Card>
      <CardHeader>
        <CardTitle>🧭 {t(M.plannerTitle)}</CardTitle>
      </CardHeader>
      <CardContent className="stack">
        <label className="flex flex-col gap-2">
          <span className="text-base font-semibold">
            {t(M.distance)}: {km} km
          </span>
          <input type="range" min={0.5} max={40} step={0.5} value={km} onChange={(e) => setKm(Number(e.target.value))} className="h-8 accent-primary" />
        </label>
        <div className="chip-row">
          <button className="chip" data-active={luggage} onClick={() => setLuggage(!luggage)}>🧳 {t(M.luggage)}</button>
          <button className="chip" data-active={night} onClick={() => setNight(!night)}>🌙 {t(M.lateNight)}</button>
          <button className="chip" data-active={mobility} onClick={() => setMobility(!mobility)}>♿ {t(M.mobility)}</button>
        </div>
        {/* Group size is rarely needed — tucked away, defaults to 1 */}
        <details className="group">
          <summary className="w-fit cursor-pointer list-none text-sm font-semibold text-muted-foreground">
            👥 {t(M.people)}: {people}
            {people === 4 ? '+' : ''} <span className="inline-block transition-transform group-open:rotate-180">▾</span>
          </summary>
          <div className="chip-row mt-2">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className="chip" data-active={people === n} onClick={() => setPeople(n)}>
                👤 {n}
                {n === 4 ? '+' : ''}
              </button>
            ))}
          </div>
        </details>
        <div className="flex flex-col gap-2">
          {results.map((m, i) => (
            <div key={m.id} className="phrase-row items-start" data-disabled={!m.available}>
              <span className="text-3xl">{m.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{t(m.name)}</p>
                  {i === 0 && m.available && <span className="status-pill status-safe">{t(M.best)}</span>}
                  {!m.available && <span className="status-pill status-danger">{t(M.notRec)}</span>}
                </div>
                <p className="tabular-nums">
                  ~{m.minutes} {t(M.min)} · ₩{m.cost.toLocaleString()}
                </p>
                <ul className="mt-1 text-sm text-muted-foreground">
                  {m.notes.map((n) => (
                    <li key={n.en}>• {t(n)}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t(M.estimates)}</p>
      </CardContent>
    </Card>
  )
}

export function GoTab() {
  const { t } = useT()
  return (
    <div className="stack">
      <PageIntro title={t(M.go)} tip={t(M.goTip)} />
      <RouteFinder />
      <TripPlanner />

      <Card>
        <CardHeader>
          <CardTitle>⛰️ {t(M.steepTitle)}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {STEEP_SPOTS.map((s) => (
            <div key={s.place.en} className="info-row flex-col gap-1">
              <p className="font-semibold">{t(s.place)}</p>
              <p className="text-danger">⚠️ {t(s.issue)}</p>
              <p className="text-safe">→ {t(s.tip)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🇰🇷 {t(M.rulesTitle)}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {ETIQUETTE.map((e) => (
            <div key={e.title.en} className="info-row">
              <span className="text-2xl">{e.emoji}</span>
              <div>
                <p className="font-semibold">{t(e.title)}</p>
                <p className="text-muted-foreground">{t(e.body)}</p>
              </div>
            </div>
          ))}
          <p className="section-label mt-2">{t(M.lineCut)}</p>
          <KoreanCard ko="줄 서 있는 거예요. 뒤로 서 주세요." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🛡️ {t(M.safetyTitle)}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {SAFETY_TIPS.map((s) => (
              <li key={s.en}>• {t(s)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
