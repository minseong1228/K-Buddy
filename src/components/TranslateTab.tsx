import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Mic, MicOff, Send, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageIntro } from '@/components/Mascot'
import { api } from '@/api'
import { useAi } from '@/hooks/useAi'
import { M } from '@/i18n/messages'
import { speakKorean, useSpeechRecognition } from '@/lib/speech'
import { LANGS, speechLang, useT } from '@/lib/i18n'

type Who = 'me' | 'staff'
type Turn = { id: number; who: Who; src: string; out: string }

/** Two-way conversation translator: my language ⇄ Korean, by voice or text. */
export function TranslateTab() {
  const { t, lang } = useT()
  const { supported, listening, transcript, setTranscript, start, stop } = useSpeechRecognition()
  const { run, busy } = useAi()
  const [turns, setTurns] = useState<Turn[]>([])
  const [speaker, setSpeaker] = useState<Who | null>(null)
  const [typed, setTyped] = useState('')
  const [failed, setFailed] = useState<{ who: Who; src: string } | null>(null)
  const inFlight = useRef(false)
  const end = useRef<HTMLDivElement>(null)
  const me = LANGS.find((l) => l.id === lang)!

  const translate = async (who: Who, src: string): Promise<boolean> => {
    if (inFlight.current) return false
    inFlight.current = true
    setFailed(null)
    try {
      const out = await run(() => (who === 'me' ? api.translate(src, lang, 'ko') : api.translate(src, 'ko', lang)))
      if (typeof out !== 'string' || !out.trim()) {
        setFailed({ who, src })
        return false
      }
      setTurns((ts) => [...ts, { id: Date.now(), who, src, out }])
      // Audio failure must not discard a successful text translation.
      if (who === 'me') {
        try { speakKorean(out) } catch { /* The translated text remains available. */ }
      }
      return true
    } catch {
      setFailed({ who, src })
      return false
    } finally {
      inFlight.current = false
    }
  }

  // When a voice turn finishes, translate it.
  useEffect(() => {
    if (listening || !speaker) return
    const src = transcript.trim()
    setSpeaker(null)
    setTranscript('')
    if (src) void translate(speaker, src)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening])

  useEffect(() => {
    // Modern browsers return a Promise; React effects must not return it as cleanup. Only scroll once there is a chat.
    if (turns.length) void end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns])

  const talk = (who: Who) => {
    if (listening) return stop()
    setSpeaker(who)
    start(who === 'me' ? speechLang(lang) : 'ko-KR')
  }

  const send = async (e: FormEvent) => {
    e.preventDefault()
    const src = typed.trim()
    if (!src || busy || listening || inFlight.current) return
    if (await translate('me', src)) setTyped('')
  }

  return (
    <div className="stack">
      <PageIntro title={t(M.translate)} tip={t(M.translateTip)} />

      <div className="flex min-h-40 flex-col gap-3">
        {turns.map((x) =>
          x.who === 'me' ? (
            <div key={x.id} className="pop-in ml-8 flex flex-col gap-2 self-end rounded-2xl rounded-br-sm bg-primary p-4 text-primary-foreground">
              <p className="text-sm opacity-80">{x.src}</p>
              <p className="ko-text text-2xl">{x.out}</p>
              <Button variant="secondary" className="big-btn self-start" onClick={() => speakKorean(x.out)}>
                <Volume2 /> {t(M.play)}
              </Button>
            </div>
          ) : (
            <div key={x.id} className="pop-in mr-8 flex flex-col gap-1 self-start rounded-2xl rounded-bl-sm border bg-card p-4">
              <p className="text-sm text-muted-foreground">🇰🇷 {x.src}</p>
              <p className="text-2xl font-semibold">{x.out}</p>
            </div>
          ),
        )}
        {(listening || busy) && <p className="text-center text-muted-foreground">{listening ? `🎙️ ${transcript || t(M.listening)}` : t(M.aiThinking)}</p>}
        <div ref={end} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="home-tile items-center justify-center bg-primary text-primary-foreground" disabled={!supported || busy} onClick={() => talk('me')}>
          {listening && speaker === 'me' ? <MicOff className="size-10" /> : <Mic className="size-10" />}
          <span className="text-lg font-bold">
            {me.flag} {t(M.me)}
          </span>
        </button>
        <button className="home-tile items-center justify-center bg-accent text-accent-foreground" disabled={!supported || busy} onClick={() => talk('staff')}>
          {listening && speaker === 'staff' ? <MicOff className="size-10" /> : <Mic className="size-10" />}
          <span className="text-lg font-bold">🇰🇷 {t(M.staffSide)}</span>
        </button>
      </div>
      {!supported && <p className="text-center text-danger">{t(M.noVoice)}</p>}

      {failed && (
        <div role="alert" className="status-warn flex flex-col gap-3 rounded-xl p-4">
          <p>{t(M.translationFailed)}</p>
          <p className="break-words">{failed.src}</p>
          <Button variant="outline" className="big-btn self-start" disabled={busy || listening} onClick={async () => {
            const { who, src } = failed
            if (await translate(who, src)) setTyped((value) => value.trim() === src ? '' : value)
          }}>
            {t(M.retry)}
          </Button>
        </div>
      )}
      <form className="flex gap-2" onSubmit={send}>
        <input
          className="h-12 min-w-0 flex-1 rounded-xl border bg-card px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder={t(M.typeHere)}
          value={typed}
          disabled={busy || listening}
          aria-label={t(M.typeHere)}
          onChange={(e) => setTyped(e.target.value)}
          enterKeyHint="send"
        />
        <Button type="submit" className="size-12" disabled={busy || listening || !typed.trim()} aria-label="send">
          <Send />
        </Button>
      </form>
    </div>
  )
}
