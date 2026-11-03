import { useState } from 'react'
import { Globe, Menu, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { KoreanCard } from '@/components/KoreanCard'
import { Mascot } from '@/components/Mascot'
import { SettingsDialog } from '@/components/SettingsDialog'
import { AppDrawer } from '@/components/AppDrawer'
import { ShareDialog } from '@/components/ShareDialog'
import { M } from '@/i18n/messages'
import { LANGS, useT, type Lang } from '@/lib/i18n'
import type { Step } from '@/lib/profile'

const HOTLINES = [
  { num: '112', label: M.police },
  { num: '119', label: M.ambulance },
  { num: '1330', label: M.hotline },
]

export function SosDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useT()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🆘 {t(M.sos)}</DialogTitle>
          <DialogDescription>{t(M.sosDesc2)}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {HOTLINES.map((h) => (
            <a key={h.num} href={`tel:${h.num}`} className="phrase-row min-h-16">
              <Phone className="size-6 text-accent" />
              <span className="text-3xl font-bold tabular-nums">{h.num}</span>
              <span className="text-sm text-muted-foreground">{t(h.label)}</span>
            </a>
          ))}
        </div>
        <KoreanCard ko="도와주세요! 한국어를 못해요." meaning={t(M.helpMe)} />
      </DialogContent>
    </Dialog>
  )
}

function LanguageDialog({ open, onOpenChange, lang, onLang }: { open: boolean; onOpenChange: (o: boolean) => void; lang: Lang; onLang: (l: Lang) => void }) {
  const { t } = useT()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🌐 {t(M.language)}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LANGS.map((l, i) => (
            <button
              key={l.id}
              className="lang-btn pop-in"
              style={{ animationDelay: `${i * 50}ms` }}
              data-active={lang === l.id}
              onClick={() => {
                onLang(l.id)
                onOpenChange(false)
              }}
            >
              <span className="text-2xl">{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AppHeader({
  onLang,
  onHome,
  onEdit,
  onStartOver,
  onShopQr,
}: {
  onLang: (l: Lang) => void
  onHome: () => void
  onEdit: (step: Step) => void
  onStartOver: () => void
  onShopQr: () => void
}) {
  const { t, lang } = useT()
  const [sos, setSos] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const current = LANGS.find((l) => l.id === lang)!
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="app-container flex h-14 items-center gap-2">
        <button className="flex items-center gap-2" onClick={onHome}>
          <img src="/favicon.svg" alt="" className="size-7" />
          <span className="font-heading text-lg font-bold tracking-tight max-[380px]:hidden">K-Buddy</span>
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="buddy-pick size-10 border-2 shadow-none" onClick={() => setSettingsOpen(true)} aria-label={t(M.settings)}>
            <Mascot className="size-8" />
          </button>
          <Button variant="outline" className="h-10 rounded-full px-3" onClick={() => setLangOpen(true)} aria-label={t(M.language)}>
            <Globe /> {current.flag}
          </Button>
          <Button variant="destructive" className="h-10 rounded-full px-3 font-bold" onClick={() => setSos(true)}>
            {t(M.sos)}
          </Button>
          <Button variant="ghost" size="icon-lg" className="size-10" onClick={() => setDrawerOpen(true)} aria-label={t(M.menu)}>
            <Menu className="size-6" />
          </Button>
        </div>
      </div>
      <SosDialog open={sos} onOpenChange={setSos} />
      <AppDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSettings={() => setSettingsOpen(true)}
        onLanguage={() => setLangOpen(true)}
        onShare={() => setShareOpen(true)}
        onShopQr={onShopQr}
      />
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} onEdit={onEdit} onStartOver={onStartOver} />
      <LanguageDialog open={langOpen} onOpenChange={setLangOpen} lang={lang} onLang={onLang} />
    </header>
  )
}
