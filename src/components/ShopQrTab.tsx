import { useState } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mascot, PageIntro } from '@/components/Mascot'
import { QrCode } from '@/components/QrCode'
import { M } from '@/i18n/messages'
import { useT } from '@/lib/i18n'
import { shopUrl, type ShopType } from '@/lib/shop'

const TYPES: { id: ShopType; emoji: string; ko: string }[] = [
  { id: 'cafe', emoji: '☕', ko: '카페' },
  { id: 'food', emoji: '🍜', ko: '식당' },
  { id: 'store', emoji: '🛍️', ko: '가게' },
]

/** Poster lines are fixed in every language — the guest may speak any of them. */
const SCAN_LINES = [
  'Scan to order in your language',
  '扫码，用你的语言点单',
  'スキャンして母国語で注文',
  'Quét để gọi món bằng tiếng của bạn',
  'สแกนเพื่อสั่งเป็นภาษาของคุณ',
  'Pindai untuk pesan dalam bahasamu',
]

/** For small shop owners: a printable "foreigners welcome" QR poster. Social impact: no foreign language needed. */
export function ShopQrTab() {
  const { t } = useT()
  const [name, setName] = useState('')
  const [type, setType] = useState<ShopType>('cafe')
  const shop = { name: name.trim() || '우리 가게', type }

  return (
    <div className="stack">
      <div className="print-hide stack">
        <PageIntro title={t(M.shopQr)} tip={t(M.shopQrDesc)} />
        <label className="flex flex-col gap-1">
          <span className="section-label">{t(M.shopName)}</span>
          <Input className="h-12 text-lg" placeholder="예) 보리카페 명동점" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
        </label>
        <div className="chip-row">
          {TYPES.map((x) => (
            <button key={x.id} className="chip" data-active={type === x.id} onClick={() => setType(x.id)}>
              {x.emoji} {x.ko}
            </button>
          ))}
        </div>
        <Button className="big-btn h-14 w-full text-lg" onClick={() => window.print()}>
          <Printer /> {t(M.print)}
        </Button>
      </div>

      <div className="print-area flex flex-col items-center gap-4 rounded-3xl border-4 border-primary bg-white p-6 text-center text-[#1f2a5c]">
        <p className="text-2xl font-extrabold">외국인 손님 환영합니다</p>
        <p className="-mt-3 text-lg font-bold">Foreigners welcome · 欢迎 · ようこそ</p>
        <div className="flex items-center gap-3">
          <Mascot className="size-20" />
          <QrCode value={shopUrl(shop)} className="w-52" />
        </div>
        <p className="text-xl font-bold">
          {TYPES.find((x) => x.id === type)!.emoji} {shop.name}
        </p>
        <ul className="flex flex-col gap-0.5 text-sm font-semibold">
          {SCAN_LINES.map((l) => (
            <li key={l}>📷 {l}</li>
          ))}
        </ul>
        <p className="text-xs opacity-70">K-Buddy · 직원은 손님 화면의 한국어를 읽기만 하면 돼요</p>
      </div>
    </div>
  )
}
