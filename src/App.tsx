import { Suspense, lazy, useEffect, useState, type ComponentType } from 'react'
import { AppHeader, SosDialog } from '@/components/AppHeader'
import { BoriMenu, type NavItem } from '@/components/BoriMenu'
import { HomeTab } from '@/components/HomeTab'
import { Onboarding } from '@/components/Onboarding'
import { AiKeyProvider } from '@/components/AiKeyProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NetworkWatch } from '@/components/NetworkWatch'
import { Toaster } from '@/components/ui/sonner'
import { Coffee, Languages, Luggage, Route, ScanLine, Siren, Sparkles, Utensils, Wallet } from 'lucide-react'
import { M } from '@/i18n/messages'
import { LangContext } from '@/lib/i18n'
import { setVoiceBuddy } from '@/lib/speech'
import { SHOP } from '@/lib/shop'
import { ProfileContext, loadProfile, saveProfile, type Profile, type Step } from '@/lib/profile'

// Each tab loads on first open — keeps the first screen fast on mobile data.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] })))
const PAGES = {
  translate: page(() => import('@/components/TranslateTab'), 'TranslateTab'),
  shopqr: page(() => import('@/components/ShopQrTab'), 'ShopQrTab'),
  ready: page(() => import('@/components/ReadyTab'), 'ReadyTab'),
  talk: page(() => import('@/components/TalkTab'), 'TalkTab'),
  food: page(() => import('@/components/FoodTab'), 'FoodTab'),
  pay: page(() => import('@/components/MoneyTab'), 'MoneyTab'),
  go: page(() => import('@/components/GoTab'), 'GoTab'),
  check: page(() => import('@/components/CheckTab'), 'CheckTab'),
}
type PageId = keyof typeof PAGES | 'home'

/** Home tiles, essentials first. `page` = which screen a tile opens. */
const NAV: NavItem[] = [
  { id: 'translate', emoji: '🗣️', icon: Languages, label: M.translate, desc: M.speakDesc },
  { id: 'go', emoji: '🗺️', icon: Route, label: M.route, desc: M.goDesc },
  { id: 'check', emoji: '🔎', icon: ScanLine, label: M.scan, desc: M.checkDesc },
  { id: 'food', emoji: '🍜', icon: Utensils, label: M.food, desc: M.foodDesc },
  { id: 'pay', emoji: '💳', icon: Wallet, label: M.pay, desc: M.payDesc },
  { id: 'talk', emoji: '☕', icon: Coffee, label: M.cafe, desc: M.talkDesc },
  { id: 'aihelp', emoji: '✨', icon: Sparkles, label: M.aiHelp, desc: M.situationTitle, page: 'talk' },
  { id: 'ready', emoji: '🧳', icon: Luggage, label: M.ready, desc: M.readyDesc },
  { id: 'sos', emoji: '🆘', icon: Siren, label: M.sos, desc: M.sosDesc, tone: 'danger' },
]
const FAB_NAV: NavItem[] = [{ id: 'home', emoji: '🏠', label: M.home }, ...NAV]

export default function App() {
  const [profile, setProfile] = useState<Profile>(loadProfile)
  // A shop QR opens straight on the ordering screen
  const [page, setPage] = useState<PageId>(SHOP ? 'talk' : 'home')
  const [sos, setSos] = useState(false)
  // Editing one onboarding step from settings; `before` lets the user undo it.
  const [editing, setEditing] = useState<{ step: Step; before: Profile } | null>(null)

  const updateProfile = (patch: Partial<Profile>) =>
    setProfile((p) => {
      const next = { ...p, ...patch }
      saveProfile(next)
      return next
    })
  useEffect(() => {
    document.documentElement.lang = profile.lang
  }, [profile.lang])
  useEffect(() => setVoiceBuddy(profile.buddy), [profile.buddy])

  const go = (id: string) => {
    if (id === 'sos') return setSos(true)
    setPage(id as PageId)
    window.scrollTo({ top: 0 })
  }

  const Page = page === 'home' ? null : PAGES[page]

  return (
    <ProfileContext value={profile}>
      <LangContext value={profile.lang}>
        <AiKeyProvider>
        {!profile.onboarded ? (
          <Onboarding
            quick={!!SHOP}
            onChange={updateProfile}
            onDone={() => (updateProfile({ onboarded: true }), go(SHOP ? 'talk' : 'home'))}
          />
        ) : editing ? (
          <Onboarding
            single={editing.step}
            onChange={updateProfile}
            onDone={() => setEditing(null)}
            onCancel={() => {
              updateProfile(editing.before)
              setEditing(null)
            }}
          />
        ) : (
          <>
            <AppHeader
              onLang={(lang) => updateProfile({ lang })}
              onHome={() => go('home')}
              onEdit={(step) => setEditing({ step, before: profile })}
              onStartOver={() => updateProfile({ onboarded: false })}
              onShopQr={() => go('shopqr')}
            />
            <main className="app-container pt-4 pb-32">
              <ErrorBoundary key={page} onHome={() => go('home')}>
                {Page ? (
                  <Suspense fallback={<p className="py-10 text-center text-muted-foreground">…</p>}>
                    <Page />
                  </Suspense>
                ) : (
                  <HomeTab items={NAV} onPick={go} />
                )}
              </ErrorBoundary>
            </main>
            {page !== 'home' && <BoriMenu items={FAB_NAV} active={page} onPick={go} />}
            <SosDialog open={sos} onOpenChange={setSos} />
          </>
        )}
        </AiKeyProvider>
        <NetworkWatch />
        <Toaster position="top-center" />
      </LangContext>
    </ProfileContext>
  )
}
