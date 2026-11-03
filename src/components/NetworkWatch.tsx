import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { M } from '@/i18n/messages'
import { useT } from '@/lib/i18n'
import { MIC_DENIED_EVENT } from '@/lib/speech'

/** Offline banner (roaming drops are common) + one place to explain a blocked microphone. */
export function NetworkWatch() {
  const { t } = useT()
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    const mic = () => toast.error(t(M.micDenied))
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    window.addEventListener(MIC_DENIED_EVENT, mic)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
      window.removeEventListener(MIC_DENIED_EVENT, mic)
    }
  }, [t])

  if (online) return null
  return <div className="fixed inset-x-0 top-0 z-50 bg-warn px-4 py-2 text-center text-sm font-semibold text-white">📡 {t(M.offline)}</div>
}
