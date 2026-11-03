import { useState } from 'react'
import { Maximize2, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { M } from '@/i18n/messages'
import { speakKorean } from '@/lib/speech'
import { useT } from '@/lib/i18n'

/** Korean sentence + meaning, with speak and "show to staff" full-screen buttons. */
export function KoreanCard({ ko, meaning, roman }: { ko: string; meaning?: string; roman?: string }) {
  const [open, setOpen] = useState(false)
  const { t } = useT()
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <p className="ko-text text-xl">{ko}</p>
      {roman && <p className="text-xs text-muted-foreground">{roman}</p>}
      {meaning && meaning !== ko && <p className="text-sm text-muted-foreground">{meaning}</p>}
      <div className="flex gap-2">
        <Button className="big-btn flex-1" onClick={() => speakKorean(ko)}>
          <Volume2 /> {t(M.play)}
        </Button>
        <Button variant="outline" className="big-btn flex-1" onClick={() => setOpen(true)}>
          <Maximize2 /> {t(M.showStaff)}
        </Button>
      </div>
      <ShowDialog open={open} onOpenChange={setOpen} ko={ko} meaning={meaning} />
    </div>
  )
}

export function ShowDialog({
  open,
  onOpenChange,
  ko,
  meaning,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  ko: string
  meaning?: string
}) {
  const { t } = useT()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-3">
        <DialogTitle className="sr-only">{t(M.showStaff)}</DialogTitle>
        <div className="show-card">
          <p className="ko-text text-3xl">{ko}</p>
          {meaning && meaning !== ko && <p className="text-sm opacity-80">{meaning}</p>}
          <Button variant="secondary" className="big-btn" onClick={() => speakKorean(ko)}>
            <Volume2 /> {t(M.play)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
