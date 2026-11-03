import { Copy, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { QrCode } from '@/components/QrCode'
import { M } from '@/i18n/messages'
import { useT } from '@/lib/i18n'
import { APP_URL } from '@/lib/shop'

/** Big QR so anyone (judges, friends) can open the app by pointing a camera. */
export function ShareDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useT()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL)
      toast.success(t(M.copied))
    } catch {
      /* clipboard blocked */
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">📲 {t(M.share)}</DialogTitle>
          <DialogDescription>{t(M.shareDesc)}</DialogDescription>
        </DialogHeader>
        <QrCode value={APP_URL} className="mx-auto w-full max-w-72" />
        <p className="text-center font-semibold break-all">{APP_URL.replace('https://', '')}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="big-btn" onClick={copy}>
            <Copy /> {t(M.copyLink)}
          </Button>
          {'share' in navigator && (
            <Button className="big-btn" onClick={() => navigator.share({ title: 'K-Buddy', url: APP_URL }).catch(() => {})}>
              <Share2 /> {t(M.share)}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
