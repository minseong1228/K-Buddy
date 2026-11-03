import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KoreanCard } from '@/components/KoreanCard'
import { PageIntro } from '@/components/Mascot'
import { COMING_SOON, GUIDES } from '@/data/guides'
import { M } from '@/i18n/messages'
import { useT } from '@/lib/i18n'

export function ReadyTab() {
  const { t } = useT()
  const [open, setOpen] = useState<string | null>(GUIDES[0].id)

  return (
    <div className="stack">
      <PageIntro title={t(M.ready)} tip={t(M.readyTip)} />
      {GUIDES.map((g, i) => {
        const isOpen = open === g.id
        return (
          <div key={g.id} className="pop-in rounded-2xl border bg-card" style={{ animationDelay: `${i * 60}ms` }}>
            <button className="flex min-h-16 w-full items-center gap-3 px-4 text-left" onClick={() => setOpen(isOpen ? null : g.id)} aria-expanded={isOpen}>
              <span className="text-3xl">{g.emoji}</span>
              <span className="flex-1 text-lg font-semibold">{t(g.title)}</span>
              <ChevronDown className="size-5 transition-transform aria-expanded:rotate-180" aria-expanded={isOpen} />
            </button>
            {isOpen && (
              <div className="flex flex-col gap-3 px-4 pb-4">
                <ol className="flex flex-col gap-2">
                  {g.steps.map((s, j) => (
                    <li key={j} className="info-row text-base">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{j + 1}</span>
                      <span>{t(s)}</span>
                    </li>
                  ))}
                </ol>
                {g.ko && <KoreanCard ko={g.ko} meaning={g.koMeaning && t(g.koMeaning)} />}
              </div>
            )}
          </div>
        )
      })}

      <Card>
        <CardHeader>
          <CardTitle>🚀 {t(M.comingSoon)}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {COMING_SOON.map((c) => (
            <div key={c.title.en} className="info-row">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <p className="font-semibold">{t(c.title)}</p>
                <p className="text-muted-foreground">{t(c.desc)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
