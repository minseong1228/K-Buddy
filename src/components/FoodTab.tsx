import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KoreanCard } from '@/components/KoreanCard'
import { PageIntro } from '@/components/Mascot'
import { AiExplain, NearbyList, PhotoButton } from '@/components/ApiWidgets'
import { api, type Explanation } from '@/api'
import { useAi } from '@/hooks/useAi'
import { allergyById } from '@/data/allergies'
import { DIETS, DISHES, FLAG_INFO, INGREDIENT_KEYWORDS, SAMPLE_LABELS, type Diet, type Flag } from '@/data/food'
import { M } from '@/i18n/messages'
import { highlight } from '@/lib/highlight'
import { useT } from '@/lib/i18n'
import { fmt, useProfile } from '@/lib/profile'

type Verdict = 'safe' | 'warn' | 'danger'

function verdictFor(flags: Flag[], diet: Diet): Verdict {
  const blocks = DIETS.find((d) => d.id === diet)!.blocks
  const hits = flags.filter((f) => blocks.includes(f))
  if (hits.length === 0) return 'safe'
  // For halal, meat is "ask" (halal-certified meat exists), not "no"
  const soft: Flag[] = diet === 'halal' ? ['meat', 'beef'] : ['meat']
  if (hits.every((f) => soft.includes(f))) return 'warn'
  return 'danger'
}

function VerdictPill({ v }: { v: Verdict }) {
  const { t } = useT()
  const label = { safe: M.ok, warn: M.maybe, danger: M.avoid }[v]
  return <span className={`status-pill status-${v} shrink-0`}>{t(label)}</span>
}

function LabelChecker({ diet }: { diet: Diet }) {
  const { t, lang } = useT()
  const [text, setText] = useState('')
  const { run, busy } = useAi()
  const [ai, setAi] = useState<{ text: string; diet: Diet; result: Explanation } | null>(null)
  const { allergies } = useProfile()
  const allergyHits = allergies.map((id) => allergyById(id)!).filter((a) => a.words.some((w) => text.includes(w)))
  const askAi = async (src = text) => {
    const allergyNames = allergies.map((id) => allergyById(id)!.name.en)
    const dietName = [DIETS.find((d) => d.id === diet)!.name.en, ...allergyNames.map((n) => `allergic to ${n}`)].join('; ')
    const result = await run(() => api.explain('label', src, lang, dietName))
    if (result) setAi({ text: src, diet, result })
  }
  const blocks = DIETS.find((d) => d.id === diet)!.blocks

  const { hits, ranges, recognized } = useMemo(() => {
    const hits: { word: string; flag: Flag; en: string }[] = []
    const ranges: [number, number][] = []
    let recognized = false
    for (const k of INGREDIENT_KEYWORDS) {
      let found = false
      for (let i = text.indexOf(k.word); i >= 0; i = text.indexOf(k.word, i + 1)) {
        if (k.except?.some((ex) => text.startsWith(ex, i))) continue
        recognized = true
        if (!blocks.includes(k.flag)) continue
        ranges.push([i, i + k.word.length])
        found = true
      }
      if (found) hits.push(k)
    }
    return { hits, ranges, recognized }
  }, [text, blocks])

  // No keyword match is not evidence that a label is safe or even readable.
  const caution = hits.length > 0 || allergyHits.length > 0
  const labelStatus = caution ? M.labelCaution : recognized ? M.labelReview : M.labelUnknown
  const labelAi = ai?.text === text && ai.diet === diet ? ai.result : null
  // An AI result cannot turn a limited ingredient check into a safety guarantee.
  const reviewedAi = labelAi ? { ...labelAi, verdict: caution || labelAi.verdict === 'danger' ? 'danger' as const : 'warn' as const } : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔎 {t(M.labelTitle)}</CardTitle>
        <CardDescription>{t(M.labelDesc)}</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <PhotoButton kind="label" onText={(txt) => (setText(txt), void askAi(txt))} />
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="원재료명: ..." />
        <div className="chip-row">
          {SAMPLE_LABELS.map((s, i) => (
            <button key={s} className="chip" onClick={() => setText(s)}>
              {t(M.sample)} {i + 1}
            </button>
          ))}
        </div>
        {allergyHits.length > 0 && (
          <div className="pop-in status-danger rounded-xl p-4 text-base font-semibold">
            ⚠️ {t(M.allergyHit)}: {allergyHits.map((a) => `${a.emoji} ${t(a.name)}`).join(', ')}
          </div>
        )}
        {text.trim() && (
          <div className="pop-in flex flex-col gap-3 rounded-xl border p-4">
            <span role="status" className={`status-pill status-${caution ? 'danger' : 'warn'}`}>{t(labelStatus)}</span>
            <p className="text-base text-muted-foreground">{t(M.labelCheckLimit)}</p>
            <p className="ko-text text-sm leading-relaxed">{highlight(text, ranges)}</p>
            {hits.length > 0 && (
              <ul className="flex flex-col gap-1 text-sm">
                {hits.map((h) => (
                  <li key={h.word}>
                    <b className="text-danger">{h.word}</b> = {h.en} · <span className="text-muted-foreground">{t(FLAG_INFO[h.flag])}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {text.trim() && <AiExplain busy={busy} result={reviewedAi} onAsk={() => askAi()} />}
      </CardContent>
    </Card>
  )
}

export function FoodTab() {
  const { t } = useT()
  const profile = useProfile()
  const [diet, setDiet] = useState<Diet>(profile.diet ?? 'none')
  const d = DIETS.find((x) => x.id === diet)!
  const tip = profile.diet && profile.diet !== 'none' ? fmt(t(M.dietSet), { diet: t(DIETS.find((x) => x.id === profile.diet)!.name) }) : t(M.foodTip)

  return (
    <div className="stack">
      <PageIntro title={t(M.food)} tip={tip} />
      <div className="chip-row">
        {DIETS.map((x) => (
          <button key={x.id} className="chip" data-active={diet === x.id} onClick={() => setDiet(x.id)}>
            {x.emoji} {t(x.name)}
          </button>
        ))}
      </div>

      {d.askKo && <KoreanCard ko={d.askKo} meaning={t(M.askStaffFirst)} />}
      {profile.allergies.length > 0 && (
        <KoreanCard
          ko={`저는 ${profile.allergies.map((id) => allergyById(id)!.ko).join(', ')} 알레르기가 있어요. 들어가나요?`}
          meaning={`${t(M.allergyLabel)}: ${profile.allergies.map((id) => t(allergyById(id)!.name)).join(', ')}`}
        />
      )}

      <LabelChecker diet={diet} />

      <Card>
        <CardContent>
          <NearbyList kind="halal" title={t(M.halalNearby)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🍲 {t(M.dishesTitle)}</CardTitle>
          <CardDescription>{t(M.dishesDesc)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {DISHES.map((dish) => (
            <div key={dish.ko} className="phrase-row items-start">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {dish.ko} <span className="text-sm font-normal text-muted-foreground">{t(dish.name)}</span>
                </p>
                <p className="text-sm text-muted-foreground">{t(dish.note)}</p>
              </div>
              <VerdictPill v={verdictFor(dish.flags, diet)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
