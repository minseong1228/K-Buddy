import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KoreanCard } from '@/components/KoreanCard'
import { PageIntro } from '@/components/Mascot'
import { AiExplain, PhotoButton } from '@/components/ApiWidgets'
import { api, type Explanation, type LinkCheck } from '@/api'
import { extractLinks } from '@/lib/links'
import { fmt } from '@/lib/profile'
import { useAi } from '@/hooks/useAi'
import { FINE_PRINT_RULES, SAMPLE_ADS, type FinePrintRule } from '@/data/finePrint'
import { M } from '@/i18n/messages'
import { highlight } from '@/lib/highlight'
import { useT } from '@/lib/i18n'

const THREAT: Record<string, string> = { SOCIAL_ENGINEERING: 'Phishing', MALWARE: 'Malware', UNWANTED_SOFTWARE: 'Unwanted software', POTENTIALLY_HARMFUL_APPLICATION: 'Harmful app' }

/** Smishing check: Google Safe Browsing on every link + AI reading of the whole message. */
function ScamCheck() {
  const { t, lang } = useT()
  const [text, setText] = useState('')
  const { run, busy } = useAi()
  const [ai, setAi] = useState<{ text: string; result: Explanation; links: LinkCheck[] | null } | null>(null)

  const analyze = async (src: string) => {
    const links = await api.checkLinks(extractLinks(src))
    const bad = links?.filter((l) => l.threat) ?? []
    const evidence = bad.length ? `\n\n[Google Safe Browsing flagged: ${bad.map((l) => `${l.url} (${l.threat})`).join(', ')}]` : ''
    const result = await run(() => api.explain('scam', src + evidence, lang))
    if (result) setAi({ text: src, result: bad.length ? { ...result, verdict: 'danger' } : result, links })
  }

  const shown = ai?.text === text ? ai : null
  const bad = shown?.links?.filter((l) => l.threat) ?? []

  return (
    <Card className="ring-2 ring-danger/30">
      <CardHeader>
        <CardTitle>📩 {t(M.scamTitle)}</CardTitle>
        <CardDescription>{t(M.scamDesc)}</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <PhotoButton kind="message" onText={(txt) => (setText(txt), void analyze(txt))} />
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="[국제발신] 고객님 택배 주소 불일치로 보관중 http://..." />
        {shown?.links && shown.links.length > 0 && (
          <div className={`pop-in rounded-xl p-3 text-sm font-semibold ${bad.length ? 'status-danger' : 'status-safe'}`}>
            {bad.length ? (
              <>
                🚨 {t(M.linkDanger)}
                <ul className="mt-1 font-normal break-all">
                  {bad.map((l) => (
                    <li key={l.url}>
                      • {l.url} — {THREAT[l.threat!] ?? l.threat}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>🔗 {fmt(t(M.linkClean), { n: String(shown.links.length) })}</>
            )}
          </div>
        )}
        {text.trim() && <AiExplain busy={busy} result={shown?.result ?? null} onAsk={() => analyze(text)} />}
      </CardContent>
    </Card>
  )
}

export function CheckTab() {
  const { t, lang } = useT()
  const [text, setText] = useState('')
  const { run, busy } = useAi()
  const [ai, setAi] = useState<{ text: string; result: Explanation } | null>(null)
  const askAi = async (src = text) => {
    const result = await run(() => api.explain('ad', src, lang))
    if (result) setAi({ text: src, result })
  }

  const { hits, ranges } = useMemo(() => {
    const hits: { rule: FinePrintRule; match: string }[] = []
    const ranges: [number, number][] = []
    for (const rule of FINE_PRINT_RULES) {
      const found = [...text.matchAll(rule.pattern)]
      if (found.length) hits.push({ rule, match: found[0][0] })
      for (const m of found) ranges.push([m.index, m.index + m[0].length])
    }
    hits.sort((a, b) => (a.rule.severity === b.rule.severity ? 0 : a.rule.severity === 'danger' ? -1 : 1))
    return { hits, ranges }
  }, [text])

  const status = hits.length ? (hits[0].rule.severity === 'danger' ? 'status-danger' : 'status-warn') : 'status-safe'

  return (
    <div className="stack">
      <PageIntro title={t(M.check)} tip={t(M.checkTip)} mood="think" />
      <Card>
        <CardHeader>
          <CardTitle>🧾 {t(M.pasteTitle)}</CardTitle>
        </CardHeader>
        <CardContent className="stack">
          <PhotoButton kind="ad" onText={(txt) => (setText(txt), void askAi(txt))} />
          <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="예) 삼겹살 9,900원~ *부가세 별도" />
          <div className="chip-row">
            {SAMPLE_ADS.map((s, i) => (
              <button key={s} className="chip" onClick={() => setText(s)}>
                {t(M.sample)} {i + 1}
              </button>
            ))}
          </div>
          {text.trim() && (
            <div key={text} className="pop-in flex flex-col gap-3 rounded-xl border p-4">
              <span className={`status-pill ${status}`}>{hits.length ? `${hits.length} ${t(M.foundN)}` : t(M.noneFound)}</span>
              <p className="ko-text text-sm leading-relaxed">{highlight(text, ranges)}</p>
              {hits.map(({ rule, match }) => (
                <div key={rule.label.en} className={`flex flex-col gap-0.5 rounded-lg p-3 status-${rule.severity}`}>
                  <p className="font-semibold">
                    “{match.trim()}” → {t(rule.label)}
                  </p>
                  <p className="text-sm text-foreground/80">{t(rule.explain)}</p>
                </div>
              ))}
            </div>
          )}
          {text.trim() && <AiExplain busy={busy} result={ai?.text === text ? ai.result : null} onAsk={() => askAi()} />}
        </CardContent>
      </Card>
      <KoreanCard ko="추가 요금 없이 총 얼마예요?" meaning={t(M.askTotal)} />
      <ScamCheck />
    </div>
  )
}
