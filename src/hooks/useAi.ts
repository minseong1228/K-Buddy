import { createContext, useContext, useState } from 'react'
import { toast } from 'sonner'
import { InvalidApiKeyError, MissingKeyError } from '@/api/errors'
import { M } from '@/i18n/messages'
import { clearApiKey, hasOwnKey } from '@/lib/apiKey'
import { useT } from '@/lib/i18n'

/** Opens the key modal; resolves true once a key is saved, false if closed. */
export const AiKeyContext = createContext<() => Promise<boolean>>(async () => false)

/**
 * Runs an AI call. Missing key → ask for it and retry; bad key → clear, ask again.
 * Returns null if the user gives up or the call fails (a toast explains).
 */
export function useAi() {
  const askKey = useContext(AiKeyContext)
  const { t } = useT()
  const [busy, setBusy] = useState(false)

  const run = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setBusy(true)
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          return await fn()
        } catch (e) {
          // A key typed in earlier failed → drop it and retry with the built-in key
          if (hasOwnKey() && !(e instanceof MissingKeyError)) {
            clearApiKey()
            continue
          }
          if (e instanceof InvalidApiKeyError) {
            clearApiKey()
            toast.error(t(M.keyInvalid))
          } else if (!(e instanceof MissingKeyError)) {
            console.error('[K-Buddy AI]', e)
            const detail = String((e as { message?: string })?.message ?? e).slice(0, 120)
            toast.error(t(M.aiError), { description: detail })
            return null
          }
          if (!(await askKey())) return null
        }
      }
      return null
    } finally {
      setBusy(false)
    }
  }

  return { run, busy }
}
