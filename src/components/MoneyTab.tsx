import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KoreanCard } from '@/components/KoreanCard'
import { PageIntro } from '@/components/Mascot'
import { NearbyList } from '@/components/ApiWidgets'
import { api } from '@/api'
import { useAsync } from '@/hooks/useAsync'
import { CURRENCIES, WALLETS, type WalletId } from '@/data/money'
import { M } from '@/i18n/messages'
import { useT, type Lang } from '@/lib/i18n'

const DEFAULT_CURRENCY: Partial<Record<Lang, string>> = { zh: 'CNY', ja: 'JPY', vi: 'VND', th: 'THB', id: 'IDR' }

function Converter() {
  const { t, lang } = useT()
  const [code, setCode] = useState(DEFAULT_CURRENCY[lang] ?? 'USD')
  const [krw, setKrw] = useState('10000')
  const { data } = useAsync(() => api.getExchangeRates(), 'rates')
  const rate = data?.krwPer[code]
  const foreign = rate ? (Number(krw.replace(/,/g, '')) || 0) / rate : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧮 {t(M.converterTitle)}
        </CardTitle>
        {data && (
          <CardDescription>
            {t(M.rateAt)} {new Date(data.updatedAt).toLocaleString()} · 1 {code} ≈ ₩{rate?.toLocaleString(undefined, { maximumFractionDigits: 3 })}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="stack">
        <div className="chip-row">
          {CURRENCIES.map((c) => (
            <button key={c.code} className="chip" data-active={code === c.code} onClick={() => setCode(c.code)}>
              {c.code} · {t(c.name)}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1">
          <span className="section-label">₩ KRW</span>
          <Input inputMode="numeric" className="h-12 text-xl" value={krw} onChange={(e) => setKrw(e.target.value)} />
        </label>
        <p className="text-3xl font-semibold tabular-nums">
          = {foreign === null ? '…' : foreign.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-lg text-muted-foreground">{code}</span>
        </p>
      </CardContent>
    </Card>
  )
}

export function MoneyTab() {
  const { t } = useT()
  const [wallet, setWallet] = useState<WalletId>('wechat')
  const w = WALLETS.find((x) => x.id === wallet)!
  const nearbyKind = wallet === 'wechat' ? 'wechat' : wallet === 'alipay' ? 'alipay' : null

  return (
    <div className="stack">
      <PageIntro title={t(M.pay)} tip={t(M.payTip)} />
      <div className="chip-row">
        {WALLETS.map((x) => (
          <button key={x.id} className="chip" data-active={wallet === x.id} onClick={() => setWallet(x.id)}>
            {x.emoji} {t(x.name)}
          </button>
        ))}
      </div>
      <ol key={wallet} className="flex flex-col gap-3">
        {w.steps.map((s, i) => (
          <li key={i} className="pop-in flex gap-3" style={{ animationDelay: `${i * 80}ms` }}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{i + 1}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="text-lg font-semibold">{t(s.title)}</p>
              <p className="text-muted-foreground">{t(s.body)}</p>
              {s.ko && <KoreanCard ko={s.ko} />}
            </div>
          </li>
        ))}
      </ol>
      <Card>
        <CardContent className="stack">
          {nearbyKind && <NearbyList kind={nearbyKind} title={t(M.payNearby)} />}
          <NearbyList kind="atm" title={t(M.atmNearby)} />
        </CardContent>
      </Card>
      <Converter />
    </div>
  )
}
