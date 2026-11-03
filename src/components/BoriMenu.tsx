import { useState } from 'react'
import { Mascot } from '@/components/Mascot'
import { useTypewriter } from '@/hooks/useTypewriter'
import { M } from '@/i18n/messages'
import type { LucideIcon } from 'lucide-react'
import { useT, type Tx } from '@/lib/i18n'

export type NavItem = { id: string; emoji: string; icon?: LucideIcon; label: Tx; desc?: Tx; tone?: 'danger'; page?: string }

/** Pop-out items, appearing one after another (따다다닥). */
export function PopItems({ items, active, onPick }: { items: NavItem[]; active?: string; onPick: (id: string) => void }) {
  const { t } = useT()
  return items.map((it, i) => (
    <button
      key={it.id}
      className="bori-item pop-in"
      style={{ animationDelay: `${i * 70}ms` }}
      data-active={active === it.id}
      data-tone={it.tone}
      onClick={() => onPick(it.page ?? it.id)}
    >
      <span className="text-3xl">{it.emoji}</span>
      <span className="flex min-w-0 flex-col">
        <span className="text-lg leading-tight font-bold">{t(it.label)}</span>
        {it.desc && <span className="truncate text-sm opacity-75">{t(it.desc)}</span>}
      </span>
    </button>
  ))
}

/** Floating Bori button on every page. Tap → Bori talks and the menu pops out. */
export function BoriMenu({ items, active, onPick }: { items: NavItem[]; active: string; onPick: (id: string) => void }) {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const [taps, setTaps] = useState(0)
  const said = useTypewriter(open ? t(M.boriAsk) : '', taps)

  const toggle = () => {
    setOpen((o) => !o)
    setTaps((n) => n + 1)
  }

  return (
    <>
      {open && <div className="bori-backdrop" onClick={() => setOpen(false)} />}
      {open && (
        <div className="bori-menu">
          <p className="speech-bubble pop-in self-end rounded-br-sm rounded-bl-2xl bg-card text-base text-foreground shadow-lg">{said || ' '}</p>
          <PopItems
            items={items}
            active={active}
            onPick={(id) => {
              setOpen(false)
              onPick(id)
            }}
          />
        </div>
      )}
      <div className="bori-fab">
        <button key={taps} className="bori-fab-btn bori-jump" onClick={toggle} aria-label="Bori menu">
          <Mascot mood={open ? 'wow' : 'happy'} className="size-15" />
        </button>
        <span className="bori-fab-label">{open ? t(M.close) : t(M.tapMe)}</span>
      </div>
    </>
  )
}
