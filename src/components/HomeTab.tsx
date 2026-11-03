import { useState } from 'react'
import { Mascot } from '@/components/Mascot'
import type { NavItem } from '@/components/BoriMenu'
import { buddyById } from '@/data/buddies'
import { useTypewriter } from '@/hooks/useTypewriter'
import { M } from '@/i18n/messages'
import { speechLang, useT } from '@/lib/i18n'
import { speak } from '@/lib/speech'
import { fmt, useProfile } from '@/lib/profile'

/** Buddy says hello, then big icon tiles — everything is one tap away. */
export function HomeTab({ items, onPick }: { items: NavItem[]; onPick: (id: string) => void }) {
  const { t, lang } = useT()
  const { buddy, nickname } = useProfile()
  const [taps, setTaps] = useState(0)
  const hello = nickname ? fmt(t(M.helloName), { name: nickname }) : fmt(t(M.boriHello), { buddy: buddyById(buddy).name })
  const said = useTypewriter(taps ? t(M.boriAsk) : hello, taps)

  return (
    <div className="flex flex-col gap-5 pt-1">
      <div className="flex items-end gap-3">
        <button
          key={taps}
          className="bori-jump shrink-0 rounded-full"
          onClick={() => {
            setTaps((n) => n + 1)
            speak(fmt(t(M.boriHello), { buddy: buddyById(buddy).name }), speechLang(lang))
          }}
          aria-label="buddy"
        >
          <Mascot mood={taps ? 'wow' : 'happy'} className="size-24" />
        </button>
        <p className="speech-bubble min-h-12 flex-1 px-4 py-2.5 text-lg">{said || ' '}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((it, i) => {
          const Icon = it.icon
          return (
            <button key={it.id} className="app-tile pop-in" style={{ animationDelay: `${i * 40}ms` }} data-tone={it.tone} onClick={() => onPick(it.page ?? it.id)}>
              {Icon ? <Icon className="app-tile-icon" strokeWidth={1.8} /> : <span className="text-3xl">{it.emoji}</span>}
              <span className="app-tile-label">{t(it.label)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
