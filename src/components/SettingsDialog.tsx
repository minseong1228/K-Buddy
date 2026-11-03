import type { ReactNode } from 'react'
import { ChevronRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mascot } from '@/components/Mascot'
import { allergyById } from '@/data/allergies'
import { beliefById } from '@/data/beliefs'
import { buddyById } from '@/data/buddies'
import { M } from '@/i18n/messages'
import { LANGS, useT } from '@/lib/i18n'
import { useProfile, type Step } from '@/lib/profile'

/** Everything picked at onboarding, each line re-openable on its own. */
export function SettingsDialog({
  open,
  onOpenChange,
  onEdit,
  onStartOver,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onEdit: (step: Step) => void
  onStartOver: () => void
}) {
  const { t } = useT()
  const p = useProfile()
  const lang = LANGS.find((l) => l.id === p.lang)!
  const belief = beliefById(p.belief)
  const rows: { step: Step; icon: ReactNode; label: string; value: string }[] = [
    { step: 'lang', icon: <span className="text-3xl">{lang.flag}</span>, label: t(M.language), value: lang.label },
    { step: 'buddy', icon: <Mascot className="size-10" />, label: t(M.myBuddy), value: buddyById(p.buddy).name },
    { step: 'belief', icon: <span className="text-3xl">{belief?.emoji ?? '🍽️'}</span>, label: t(M.foodRules), value: belief ? t(belief.name) : t(M.notSet) },
    {
      step: 'allergy',
      icon: <span className="text-3xl">🥜</span>,
      label: t(M.allergyLabel),
      value: p.allergies.length ? p.allergies.map((id) => t(allergyById(id)!.name)).join(', ') : t(M.noAllergy),
    },
  ]
  const pick = (fn: () => void) => () => {
    onOpenChange(false)
    fn()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>⚙️ {t(M.settings)}</DialogTitle>
          <DialogDescription>{t(M.settingsDesc)}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <button key={r.step} className="setting-row" onClick={pick(() => onEdit(r.step))}>
              <span className="flex size-11 shrink-0 items-center justify-center">{r.icon}</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="truncate text-lg font-semibold">{r.value}</span>
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          ))}
        </div>
        <Button variant="ghost" className="big-btn" onClick={pick(onStartOver)}>
          <RotateCcw /> {t(M.startOver)}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
