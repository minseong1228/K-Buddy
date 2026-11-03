import { Globe, KeyRound, QrCode, Settings, Store } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Mascot } from '@/components/Mascot'
import { M } from '@/i18n/messages'
import { clearApiKey, hasOwnKey } from '@/lib/apiKey'
import { useT } from '@/lib/i18n'

/** Left drawer opened by the top-right hamburger. */
export function AppDrawer({
  open,
  onOpenChange,
  onSettings,
  onLanguage,
  onShare,
  onShopQr,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSettings: () => void
  onLanguage: () => void
  onShare: () => void
  onShopQr: () => void
}) {
  const { t } = useT()
  const then = (fn: () => void) => () => {
    onOpenChange(false)
    fn()
  }
  const clearKey = () => {
    if (hasOwnKey()) {
      clearApiKey()
      toast.success(t(M.keyCleared))
    } else {
      toast.info(t(M.noKey))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Mascot className="size-12" />
            <SheetTitle className="text-xl">K-Buddy</SheetTitle>
          </div>
          <SheetDescription className="sr-only">{t(M.menu)}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          <Button className="big-btn justify-start" onClick={then(onShare)}>
            <QrCode /> {t(M.share)}
          </Button>
          <Button variant="outline" className="big-btn justify-start" onClick={then(onShopQr)}>
            <Store /> {t(M.shopQr)}
          </Button>
          <Button variant="outline" className="big-btn justify-start" onClick={then(onSettings)}>
            <Settings /> {t(M.settings)}
          </Button>
          <Button variant="outline" className="big-btn justify-start" onClick={then(onLanguage)}>
            <Globe /> {t(M.language)}
          </Button>
          <Button variant="outline" className="big-btn justify-start" onClick={then(clearKey)}>
            <KeyRound /> {t(M.clearKey)}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
