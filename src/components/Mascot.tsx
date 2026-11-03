import { useId, useRef, useState, type CSSProperties } from 'react'
import { buddyById, type Buddy } from '@/data/buddies'
import { useLook } from '@/hooks/useLook'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useProfile } from '@/lib/profile'
import { cn } from '@/lib/utils'

export type Mood = 'happy' | 'talk' | 'think' | 'wow'

const INK = '#2a160a'
const BURST = ['💖', '✨', '⭐', '💛', '🎶']

function Ears({ b }: { b: Buddy }) {
  switch (b.ears) {
    case 'round':
      return (
        <>
          <circle cx="28" cy="30" r="14" fill={b.body} />
          <circle cx="92" cy="30" r="14" fill={b.body} />
          <circle cx="28" cy="30" r="7" fill={b.belly} />
          <circle cx="92" cy="30" r="7" fill={b.belly} />
        </>
      )
    case 'long':
      return (
        <>
          <ellipse cx="40" cy="22" rx="10" ry="26" fill={b.body} transform="rotate(-12 40 22)" />
          <ellipse cx="80" cy="22" rx="10" ry="26" fill={b.body} transform="rotate(12 80 22)" />
          <ellipse cx="40" cy="24" rx="5" ry="18" fill={b.belly} transform="rotate(-12 40 24)" />
          <ellipse cx="80" cy="24" rx="5" ry="18" fill={b.belly} transform="rotate(12 80 24)" />
        </>
      )
    case 'tuft':
      return <path d="M56 26 q-2 -16 8 -20 q-2 10 4 18 z" fill={b.body} />
    case 'leaf':
      return <path d="M60 26 q10 -18 26 -14 q-8 16 -26 14 z" fill="#5fae6b" />
    default:
      return null
  }
}

/** Stable pseudo-random 0..1 from an id, so each character blinks on its own rhythm. */
function seed(id: string) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0
  return (Math.abs(h) % 1000) / 1000
}

/**
 * A K-Buddy character that feels alive: breathes, blinks, wiggles its ears,
 * follows your finger with its eyes, looks around when idle, and bursts hearts when tapped.
 * Uses the user's chosen buddy unless `buddy` is given.
 */
export function Mascot({ mood = 'happy', className, buddy }: { mood?: Mood; className?: string; buddy?: string }) {
  const profile = useProfile()
  const b = buddyById(buddy ?? profile.buddy)
  const ref = useRef<HTMLSpanElement>(null)
  const look = useLook(ref, mood !== 'think')
  const r = seed(useId())
  const [hearts, setHearts] = useState<{ id: number; x: number; emoji: string }[]>([])

  const burst = () => {
    const now = Date.now()
    const born = [0, 1, 2].map((i) => ({ id: now + i, x: 20 + ((r * 100 + i * 29) % 60), emoji: BURST[(now + i) % BURST.length] }))
    setHearts((h) => [...h, ...born])
    setTimeout(() => setHearts((h) => h.filter((x) => !born.includes(x))), 1000)
  }

  const mouth = {
    happy: <path d="M52 76 Q60 84 68 76" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />,
    talk: <ellipse className="m-talk" cx="60" cy="78" rx="6" ry="5" fill={INK} />,
    think: <path d="M54 79 H66" stroke={INK} strokeWidth="3" strokeLinecap="round" />,
    wow: <circle cx="60" cy="79" r="5" fill={INK} />,
  }[mood]
  const rhythm = { '--blink-delay': `${r * 4}s`, '--breathe-delay': `${r * 2}s` } as CSSProperties

  return (
    <span ref={ref} className={cn('mascot relative inline-block', className)} style={rhythm} onPointerDown={burst}>
      <svg viewBox="0 0 120 120" className="size-full overflow-visible" aria-hidden>
        <g className="m-ears">
          <Ears b={b} />
        </g>
        <g className="m-head">
          <ellipse cx="60" cy="66" rx="46" ry="42" fill={b.body} stroke={b.body === '#f6f1ea' ? '#e5ddd2' : 'none'} strokeWidth="2" />
          <ellipse cx="60" cy="78" rx="28" ry="20" fill={b.belly} />
          {b.stripes && (
            <>
              <path d="M60 26 v12 M48 29 l3 10 M72 29 l-3 10" stroke="#5a2d14" strokeWidth="4" strokeLinecap="round" />
              <path d="M15 60 h10 M15 70 h8 M105 60 h-10 M105 70 h-8" stroke="#5a2d14" strokeWidth="4" strokeLinecap="round" />
            </>
          )}
          {mood === 'think' ? (
            <path d="M38 58 q6 -5 12 0 M70 58 q6 -5 12 0" stroke={b.beak ? '#fff' : INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : (
            <g className="m-eyes">
              {b.beak && (
                <>
                  <circle cx="44" cy="58" r="10" fill="#fff" />
                  <circle cx="76" cy="58" r="10" fill="#fff" />
                </>
              )}
              <g className="m-pupils" transform={`translate(${look.x.toFixed(2)} ${look.y.toFixed(2)})`}>
                <ellipse cx="44" cy="58" rx="6" ry={mood === 'wow' ? 8 : 7} fill={INK} />
                <ellipse cx="76" cy="58" rx="6" ry={mood === 'wow' ? 8 : 7} fill={INK} />
                <circle cx="46" cy="55" r="2" fill="#fff" />
                <circle cx="78" cy="55" r="2" fill="#fff" />
              </g>
            </g>
          )}
          <ellipse className="m-blush" cx="32" cy="74" rx="7" ry="4" fill="#ff8a8a" opacity=".6" />
          <ellipse className="m-blush" cx="88" cy="74" rx="7" ry="4" fill="#ff8a8a" opacity=".6" />
          {b.beak ? <path d="M52 68 L68 68 L60 78 Z" fill="#f2a33a" /> : <ellipse cx="60" cy="69" rx="5" ry="3.5" fill="#5a2d14" />}
          {!b.beak && mouth}
        </g>
      </svg>
      {hearts.map((h) => (
        <span key={h.id} className="m-heart" style={{ left: `${h.x}%` }}>
          {h.emoji}
        </span>
      ))}
    </span>
  )
}

/** Page header: the buddy types one simple sentence telling the user what to do. */
export function PageIntro({ title, tip, mood = 'talk' }: { title: string; tip: string; mood?: Mood }) {
  const typed = useTypewriter(tip)
  return (
    <div className="flex items-end gap-3">
      <Mascot mood={typed.length < tip.length ? 'talk' : mood === 'talk' ? 'happy' : mood} className="size-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <h1 className="page-title">{title}</h1>
        <p className="speech-bubble min-h-9">{typed}</p>
      </div>
    </div>
  )
}
