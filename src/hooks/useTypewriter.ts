import { useEffect, useState } from 'react'

/** Reveals `text` one character at a time ("따다다닥"). Restarts when text or key changes. */
export function useTypewriter(text: string, key: unknown = 0, msPerChar = 35) {
  const id = `${String(key)}|${text}`
  const [state, setState] = useState({ id, n: 0 })
  useEffect(() => {
    const total = [...text].length
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setState({ id, n: i })
      if (i >= total) clearInterval(timer)
    }, msPerChar)
    return () => clearInterval(timer)
  }, [id, text, msPerChar])
  const n = state.id === id ? state.n : 0
  return [...text].slice(0, n).join('')
}
