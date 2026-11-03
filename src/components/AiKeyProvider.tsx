import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Mascot } from '@/components/Mascot'
import { AiKeyContext } from '@/hooks/useAi'
import { M } from '@/i18n/messages'
import { saveApiKey } from '@/lib/apiKey'
import { useT } from '@/lib/i18n'

/** BYOK: asks for the Gemini key the first time an AI feature is used. */
export function AiKeyProvider({ children }: { children: ReactNode }) {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const resolver = useRef<((ok: boolean) => void) | null>(null)

  const askKey = () =>
    new Promise<boolean>((resolve) => {
      resolver.current = resolve
      setOpen(true)
    })

  const finish = (ok: boolean) => {
    resolver.current?.(ok)
    resolver.current = null
    setOpen(false)
    setValue('')
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    saveApiKey(value)
    finish(true)
  }

  return (
    <AiKeyContext value={askKey}>
      {children}
      <Dialog open={open} onOpenChange={(o) => !o && finish(false)}>
        <DialogContent>
          <form onSubmit={submit} className="grid gap-4">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Mascot mood="wow" className="size-14" />
                <DialogTitle className="text-xl">🤖 {t(M.aiKeyTitle)}</DialogTitle>
              </div>
              <DialogDescription>
                {t(M.aiKeyDesc)}{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                  {t(M.aiKeyGet)}
                </a>
              </DialogDescription>
            </DialogHeader>
            <Input type="password" autoComplete="off" className="h-12" placeholder={t(M.aiKeyPh)} value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
            <Button type="submit" className="big-btn" disabled={!value.trim()}>
              <KeyRound /> {t(M.aiKeySave)}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AiKeyContext>
  )
}
