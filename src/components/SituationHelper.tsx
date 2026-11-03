import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KoreanCard } from '@/components/KoreanCard'
import { api, type Explanation } from '@/api'
import { useAi } from '@/hooks/useAi'
import { M } from '@/i18n/messages'
import { useSpeechRecognition } from '@/lib/speech'
import { speechLang, useT } from '@/lib/i18n'

/** "Tell me your situation" → AI says what to do, what staff will ask, and Korean sentences to show. */
export function SituationHelper() {
  const { t, lang } = useT()
  const { supported, listening, transcript, setTranscript, start, stop } = useSpeechRecognition()
  const { run, busy } = useAi()
  const [result, setResult] = useState<{ text: string; r: Explanation } | null>(null)

  // Speaking is enough: when the mic stops, ask right away.
  const spoke = useRef(false)
  useEffect(() => {
    if (listening) spoke.current = true
    else if (spoke.current) {
      spoke.current = false
      void ask()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening])

  const ask = async () => {
    const text = transcript.trim()
    if (!text) return
    const r = await run(() => api.explain('situation', text, lang))
    if (r) setResult({ text, r })
  }

  return (
    <Card className="ring-2 ring-primary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-primary" /> {t(M.situationTitle)}
        </CardTitle>
        <CardDescription>{t(M.situationDesc)}</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <div className="flex items-start gap-3">
          <span className="flex shrink-0 flex-col items-center gap-1">
            <button className="mic-btn" data-listening={listening} disabled={!supported} onClick={() => (listening ? stop() : start(speechLang(lang)))} aria-label="speak">
              {listening ? <MicOff /> : <Mic />}
            </button>
            <span className="text-xs font-semibold text-muted-foreground">{listening ? t(M.listening) : t(M.tapSpeak)}</span>
          </span>
          <textarea className="textarea min-h-16 flex-1" placeholder={t(M.situationPh)} value={transcript} onChange={(e) => setTranscript(e.target.value)} />
        </div>
        <Button className="big-btn h-14 w-full text-lg" disabled={busy || !transcript.trim()} onClick={ask}>
          <Sparkles /> {busy ? t(M.aiThinking) : t(M.askAi)}
        </Button>
        {result && (
          <div className="pop-in flex flex-col gap-3">
            <p className={`rounded-xl p-3 text-lg font-semibold ${result.r.verdict === 'danger' ? 'status-danger' : 'bg-secondary'}`}>{result.r.summary}</p>
            {result.r.points.length > 0 && (
              <ol className="flex flex-col gap-2">
                {result.r.points.map((p, i) => (
                  <li key={p} className="info-row text-base">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            )}
            {result.r.replies.map((s) => (
              <KoreanCard key={s.ko} ko={s.ko} meaning={s.meaning} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
