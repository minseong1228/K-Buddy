import { useEffect, useState } from 'react'
import { ChevronLeft, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Mascot } from '@/components/Mascot'
import { ALLERGIES } from '@/data/allergies'
import { beliefsFor } from '@/data/beliefs'
import { BUDDIES, buddyById } from '@/data/buddies'
import { useTypewriter } from '@/hooks/useTypewriter'
import { M } from '@/i18n/messages'
import { langsFor, speechLang, useT } from '@/lib/i18n'
import { setVoiceBuddy, speak } from '@/lib/speech'
import { STEPS, fmt, useProfile, type Profile, type Step } from '@/lib/profile'

const GREETINGS = ['Hello!', '안녕하세요!', '你好！', 'こんにちは！', 'Xin chào!', 'สวัสดี!', 'Halo!']

type Props = {
  onChange: (p: Partial<Profile>) => void
  onDone: () => void
  /** Edit a single step from settings, then return. */
  single?: Step
  /** Only in single mode: close and restore what was there before. */
  onCancel?: () => void
  /** Arrived from a shop QR: pick a language and go straight to ordering (rest can be set later). */
  quick?: boolean
}

/**
 * First visit: buddy greets in every language → language → buddy → belief (optional) → allergies.
 * Every step has Back; from settings each step can be reopened alone and undone.
 */
export function Onboarding({ onChange, onDone, single, onCancel, quick }: Props) {
  const { t, lang } = useT()
  const profile = useProfile()
  const [step, setStep] = useState<Step>(single ?? 'lang')
  const [langsOpen, setLangsOpen] = useState(!!single || !!quick)
  const [greet, setGreet] = useState(0)
  const [jump, setJump] = useState(0)
  const [firstLang] = useState(profile.lang)
  const buddy = buddyById(profile.buddy)
  const vars = { buddy: buddy.name }
  const index = STEPS.indexOf(step)

  const isLast = index === STEPS.length - 1
  const next = () => (single || isLast ? onDone() : setStep(STEPS[index + 1]))
  const back = () => setStep(STEPS[index - 1])

  // Cycle "hello" in every language until a language is chosen.
  useEffect(() => {
    if (step !== 'lang' || single) return
    const id = setInterval(() => setGreet((g) => (g + 1) % GREETINGS.length), 1600)
    const open = setTimeout(() => setLangsOpen(true), 3200)
    return () => {
      clearInterval(id)
      clearTimeout(open)
    }
  }, [step, single])

  const bubble = {
    lang: single ? t(M.language) : GREETINGS[greet],
    buddy: jump ? fmt(t(M.imBuddy), vars) : t(M.pickBuddy),
    belief: t(M.askBelief),
    allergy: t(M.askAllergy),
  }[step]
  const said = useTypewriter(bubble, `${step}-${jump}`)
  const bounce = () => setJump((n) => n + 1)

  return (
    <div className="onboard">
      <div className="onboard-top">
        {single ? (
          <Button variant="ghost" className="h-11 px-2 text-base" onClick={onCancel}>
            <Undo2 /> {t(M.undo)}
          </Button>
        ) : index > 0 ? (
          <Button variant="ghost" className="h-11 px-2 text-base" onClick={back}>
            <ChevronLeft /> {t(M.back)}
          </Button>
        ) : (
          <span />
        )}
        {!single && (
          <div className="flex gap-1.5" aria-label={`${index + 1} / ${STEPS.length}`}>
            {STEPS.map((s, i) => (
              <span key={s} className="step-dot" data-on={i === index} />
            ))}
          </div>
        )}
      </div>

      <p className="speech-bubble min-h-12 rounded-bl-2xl px-5 py-3 text-center text-xl">{said || ' '}</p>
      <button
        key={`${profile.buddy}-${jump}`}
        className="bori-jump rounded-full"
        onClick={() => (step === 'lang' ? setLangsOpen(true) : bounce())}
        aria-label={buddy.name}
      >
        <Mascot mood={said.length < bubble.length ? 'talk' : 'happy'} className="size-36" />
      </button>
      {step === 'lang' && !langsOpen && <p className="bori-fab-label animate-bounce text-base">👆 Tap!</p>}

      {step === 'lang' && langsOpen && (
        <div className="grid w-full grid-cols-2 gap-2">
          {langsFor(firstLang).map((l, i) => (
            <button
              key={l.id}
              className={`lang-btn pop-in ${i === 0 ? 'col-span-2' : ''}`}
              style={{ animationDelay: `${i * 70}ms` }}
              data-primary={i === 0}
              data-active={single && profile.lang === l.id}
              onClick={() => {
                onChange({ lang: l.id })
                if (quick) onDone()
                else next()
              }}
            >
              <span className="text-3xl">{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      )}

      {step === 'buddy' && (
        <>
          <p className="text-center text-lg font-semibold">
            {buddy.name} · {buddy.nameKo} — <span className="text-muted-foreground">{t(buddy.trait)}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {BUDDIES.map((b, i) => (
              <button
                key={b.id}
                className="buddy-pick pop-in"
                style={{ animationDelay: `${i * 80}ms` }}
                data-active={profile.buddy === b.id}
                onClick={() => {
                  onChange({ buddy: b.id })
                  setVoiceBuddy(b.id)
                  speak(fmt(t(M.imBuddy), { buddy: b.name }), speechLang(lang))
                  bounce()
                }}
                aria-label={b.name}
              >
                <Mascot buddy={b.id} className="size-16" />
              </button>
            ))}
          </div>
          <Button className="big-btn h-14 w-full text-lg" onClick={next}>
            {single ? t(M.done) : `${fmt(t(M.goWith), vars)} →`}
          </Button>
        </>
      )}

      {step === 'belief' && (
        <>
          <div className="grid w-full grid-cols-2 gap-2">
            {beliefsFor(lang).map((b, i) => (
              <button
                key={b.id}
                className={`lang-btn pop-in text-base ${i === 0 ? 'col-span-2' : ''}`}
                style={{ animationDelay: `${i * 60}ms` }}
                data-primary={i === 0}
                data-active={profile.belief === b.id}
                onClick={() => {
                  onChange({ belief: b.id, diet: b.diet })
                  next()
                }}
              >
                <span className="text-2xl">{b.emoji}</span> <span className="text-left leading-tight">{t(b.name)}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">🔒 {t(M.beliefNote)}</p>
        </>
      )}

      {step === 'allergy' && (
        <>
          <Button
            className="big-btn h-14 w-full text-lg"
            variant={profile.allergies.length ? 'outline' : 'default'}
            onClick={() => {
              onChange({ allergies: [] })
              next()
            }}
          >
            🙆 {t(M.noAllergy)}
          </Button>
          <div className="grid w-full grid-cols-2 gap-2">
            {ALLERGIES.map((a, i) => {
              const on = profile.allergies.includes(a.id)
              return (
                <button
                  key={a.id}
                  className="lang-btn pop-in text-base"
                  style={{ animationDelay: `${i * 50}ms` }}
                  data-active={on}
                  aria-pressed={on}
                  onClick={() => onChange({ allergies: on ? profile.allergies.filter((x) => x !== a.id) : [...profile.allergies, a.id] })}
                >
                  <span className="text-2xl">{a.emoji}</span> {t(a.name)} {on && '✓'}
                </button>
              )
            })}
          </div>
          {profile.allergies.length > 0 && (
            <Button className="big-btn h-14 w-full text-lg" onClick={next}>
              {single ? t(M.done) : isLast ? `${t(M.start)} 🎉` : `${t(M.next)} →`}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
