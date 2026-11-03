import { useEffect, useEffectEvent, useState } from 'react'

/** Runs `load` whenever `key` changes; returns { data, loading }. */
export function useAsync<T>(load: () => Promise<T>, key: string) {
  const run = useEffectEvent(load)
  const [state, setState] = useState<{ key: string | null; data: T | null }>({ key: null, data: null })
  useEffect(() => {
    let alive = true
    run().then((data) => alive && setState({ key, data }))
    return () => {
      alive = false
    }
  }, [key])
  const loading = state.key !== key
  return { data: loading ? null : state.data, loading }
}
