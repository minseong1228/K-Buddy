import { useEffect, useMemo, useRef, useState } from 'react'
import { Mic, MicOff, Sparkles, Volume2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KoreanCard, ShowDialog } from '@/components/KoreanCard'
import { PageIntro } from '@/components/Mascot'
import { SituationHelper } from '@/components/SituationHelper'
import { SHOP } from '@/lib/shop'
import { fmt } from '@/lib/profile'
import { AiExplain } from '@/components/ApiWidgets'
import { api, type Explanation } from '@/api'
import { useAi } from '@/hooks/useAi'
import { ALL_PHRASES, DRINK_OPTIONS, DRINKS, SCENARIOS, STAFF_LINES, type Phrase } from '@/data/phrases'
import { M } from '@/i18n/messages'
import { speakKorean, useSpeechRecognition } from '@/lib/speech'
import { speechLang, useT, type Lang } from '@/lib/i18n'

function CafeOrderBuilder() {
  const { t } = useT()
  const [drink, setDrink] = useState(0)
  const [iced, setIced] = useState(true)
  const [large, setLarge] = useState(false)
  const [qty, setQty] = useState(1)
  const [togo, setTogo] = useState(false)
  const [opts, setOpts] = useState<number[]>([])

  const d = DRINKS[drink]
  const ko = [
    `${iced ? '아이스' : '따뜻한'} ${d.ko} ${large ? '큰' : '작은'} 사이즈로 ${qty}잔 주세요.`,
    togo ? '포장이에요.' : '먹고 갈게요.',
    ...opts.map((i) => `${DRINK_OPTIONS[i].ko}.`),
  ].join(' ')
  const meaning = [
    `${qty} ${t(M.cup)} · ${t(iced ? M.iced : M.hot)} ${t(d.m)} (${t(large ? M.large : M.small)})`,
    t(togo ? M.toGo : M.forHere),
    ...opts.map((i) => t(DRINK_OPTIONS[i].m)),
  ].join(' · ')

  const toggleOpt = (i: number) => setOpts((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>☕ {t(M.cafeTitle)}</CardTitle>
      </CardHeader>
      <CardContent className="stack">
        <div className="chip-row">
          {DRINKS.map((x, i) => (
            <button key={x.ko} className="chip" data-active={drink === i} onClick={() => setDrink(i)}>
              {t(x.m)}
            </button>
          ))}
        </div>
        <div className="chip-row">
          <button className="chip" data-active={iced} onClick={() => setIced(true)}>🧊 {t(M.iced)}</button>
          <button className="chip" data-active={!iced} onClick={() => setIced(false)}>🔥 {t(M.hot)}</button>
          <button className="chip" data-active={!large} onClick={() => setLarge(false)}>{t(M.small)}</button>
          <button className="chip" data-active={large} onClick={() => setLarge(true)}>{t(M.large)}</button>
        </div>
        <div className="chip-row">
          <button className="chip" data-active={!togo} onClick={() => setTogo(false)}>🪑 {t(M.forHere)}</button>
          <button className="chip" data-active={togo} onClick={() => setTogo(true)}>🛍️ {t(M.toGo)}</button>
          <span className="chip">
            <button className="px-1 text-xl" aria-label="minus" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="w-12 text-center tabular-nums">
              {qty} {t(M.cup)}
            </span>
            <button className="px-1 text-xl" aria-label="plus" onClick={() => setQty((q) => Math.min(9, q + 1))}>＋</button>
          </span>
        </div>
        <div className="chip-row">
          {DRINK_OPTIONS.map((o, i) => (
            <button key={o.ko} className="chip" data-active={opts.includes(i)} onClick={() => toggleOpt(i)}>
              {t(o.m)}
            </button>
          ))}
        </div>
        <KoreanCard ko={ko} meaning={meaning} />
      </CardContent>
    </Card>
  )
}

function ReplyButtons({ replies }: { replies: Phrase[] }) {
  const { t } = useT()
  return (
    <div className="chip-row">
      {replies.map((r) => (
        <button key={r.ko} className="chip" onClick={() => speakKorean(r.ko)}>
          <Volume2 className="size-4" /> {r.ko} <span className="text-muted-foreground">{t(r.m)}</span>
        </button>
      ))}
    </div>
  )
}

function StaffListener() {
  const { t, lang } = useT()
  const ai = useAi()
  const [aiResult, setAiResult] = useState<{ text: string; result: Explanation } | null>(null)
  const { supported, listening, transcript, setTranscript, start, stop } = useSpeechRecognition()
  const [picked, setPicked] = useState<number | null>(null)

  const matched = useMemo(() => {
    if (!transcript) return picked
    const i = STAFF_LINES.findIndex((l) => l.keys.some((k) => transcript.includes(k)))
    return i >= 0 ? i : null
  }, [transcript, picked])
  const line = matched !== null ? STAFF_LINES[matched] : null

  // Staff finished talking and no common phrase matched → let AI explain without another tap.
  const heard = useRef(false)
  useEffect(() => {
    if (listening) heard.current = true
    else if (heard.current) {
      heard.current = false
      const said = transcript.trim()
      if (said && matched === null)
        void ai.run(() => api.explain('staff', said, lang)).then((result) => result && setAiResult({ text: said, result }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening])

  return (
    <Card>
      <CardHeader>
        <CardTitle>👂 {t(M.staffTitle)}</CardTitle>
        <CardDescription>{t(M.staffDesc)}</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <div className="flex items-center gap-4">
          <button
            className="mic-btn"
            data-listening={listening}
            disabled={!supported}
            onClick={() => (listening ? stop() : (setPicked(null), start('ko-KR')))}
            aria-label="listen"
          >
            {listening ? <MicOff /> : <Mic />}
          </button>
          <div className="min-w-0 flex-1 text-sm">
            {!supported && <p className="text-danger">{t(M.noVoice)}</p>}
            {supported && listening && <p className="text-muted-foreground">{t(M.listening)}</p>}
            {transcript && <p className="ko-text">“{transcript}”</p>}
            {!transcript && !listening && supported && <p className="text-muted-foreground">{t(M.orTap)}</p>}
          </div>
        </div>
        {line ? (
          <div className="pop-in flex flex-col gap-3 rounded-xl bg-secondary p-4">
            <p className="text-xs text-muted-foreground">{line.ko}</p>
            <p className="text-lg font-semibold text-secondary-foreground">{t(line.m)}</p>
            <ReplyButtons replies={line.replies} />
          </div>
        ) : (
          transcript && !listening && <p className="text-sm text-muted-foreground">{t(M.noMatch)}</p>
        )}
        {transcript && !listening && (
          <AiExplain
            busy={ai.busy}
            result={aiResult?.text === transcript ? aiResult.result : null}
            onAsk={async () => {
              const result = await ai.run(() => api.explain('staff', transcript, lang))
              if (result) setAiResult({ text: transcript, result })
            }}
          />
        )}
        <div className="chip-row">
          {STAFF_LINES.map((l, i) => (
            <button key={l.ko} className="chip" data-active={matched === i} onClick={() => (setTranscript(''), setPicked(i))}>
              {t(l.m).split(/[?？(（]/)[0]}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/** Scripts without spaces match by character, others by word. */
function scorePhrase(p: Phrase, q: string, lang: Lang) {
  const target = (p.m[lang] ?? p.m.en).toLowerCase()
  if (lang === 'zh' || lang === 'ja' || lang === 'th') {
    return [...new Set(q.replace(/[\s，。？！、]/g, ''))].filter((c) => target.includes(c)).length
  }
  if (lang === 'ko') {
    return (q.match(/[가-힣]{2,}/g) ?? []).filter((w) => p.ko.includes(w.slice(0, 2))).length
  }
  const words = q.toLowerCase().match(/[\p{L}']{3,}/gu) ?? []
  return words.filter((w) => target.includes(w)).length
}

function SpeakMyLanguage() {
  const { t, lang } = useT()
  const ai = useAi()
  const [aiKo, setAiKo] = useState<{ text: string; ko: string } | null>(null)
  const { supported, listening, transcript, setTranscript, start, stop } = useSpeechRecognition()
  const results = useMemo(() => {
    if (!transcript.trim()) return []
    return ALL_PHRASES.map((p) => ({ p, s: scorePhrase(p, transcript, lang) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => x.p)
  }, [transcript, lang])

  return (
    <Card>
      <CardHeader>
        <CardTitle>🗣️ {t(M.speakTitle)}</CardTitle>
        <CardDescription>{t(M.speakDesc)}</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <div className="flex items-center gap-3">
          <button
            className="mic-btn"
            data-listening={listening}
            disabled={!supported}
            onClick={() => (listening ? stop() : start(speechLang(lang)))}
            aria-label="speak"
          >
            {listening ? <MicOff /> : <Mic />}
          </button>
          <input
            className="h-12 min-w-0 flex-1 rounded-xl border bg-card px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder={t(M.speakPh)}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>
        {results.map((p) => (
          <KoreanCard key={p.ko} ko={p.ko} roman={p.roman} meaning={t(p.m)} />
        ))}
        {transcript.trim() && !listening && lang !== 'ko' && (
          <Button
            variant="secondary"
            className="big-btn w-full"
            disabled={ai.busy}
            onClick={async () => {
              const ko = await ai.run(() => api.translate(transcript, lang, 'ko'))
              if (ko) setAiKo({ text: transcript, ko })
            }}
          >
            <Sparkles /> {ai.busy ? t(M.aiThinking) : t(M.aiTranslate)}
          </Button>
        )}
        {aiKo?.text === transcript && <KoreanCard ko={aiKo.ko} meaning={transcript} />}
      </CardContent>
    </Card>
  )
}

function Phrasebook() {
  const { t } = useT()
  const [scene, setScene] = useState(SCENARIOS[0].id)
  const [shown, setShown] = useState<Phrase | null>(null)
  const s = SCENARIOS.find((x) => x.id === scene)!
  return (
    <Card>
      <CardHeader>
        <CardTitle>📖 {t(M.phrasebook)}</CardTitle>
      </CardHeader>
      <CardContent className="stack">
        <div className="chip-row">
          {SCENARIOS.map((x) => (
            <button key={x.id} className="chip" data-active={scene === x.id} onClick={() => setScene(x.id)}>
              {x.emoji} {t(x.name)}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {s.phrases.map((p) => (
            <div key={p.ko} className="phrase-row">
              <button className="min-w-0 flex-1 text-left" onClick={() => setShown(p)}>
                <p className="ko-text text-lg">{p.ko}</p>
                <p className="text-sm text-muted-foreground">{t(p.m)}</p>
              </button>
              <Button size="icon-lg" variant="secondary" className="size-12" onClick={() => speakKorean(p.ko)} aria-label="play">
                <Volume2 />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <ShowDialog open={!!shown} onOpenChange={(o) => !o && setShown(null)} ko={shown?.ko ?? ''} meaning={shown ? t(shown.m) : ''} />
    </Card>
  )
}

export function TalkTab() {
  const { t } = useT()
  return (
    <div className="stack">
      <PageIntro title={t(M.talk)} tip={t(M.talkTip)} />
      {SHOP && <p className="pop-in rounded-2xl bg-primary p-4 text-lg font-semibold text-primary-foreground">🏪 {fmt(t(M.welcomeShop), { shop: SHOP.name })}</p>}
      {SHOP?.type === 'cafe' ? <CafeOrderBuilder /> : null}
      <SituationHelper />
      {SHOP?.type !== 'cafe' && <CafeOrderBuilder />}
      <StaffListener />
      <SpeakMyLanguage />
      <Phrasebook />
    </div>
  )
}
