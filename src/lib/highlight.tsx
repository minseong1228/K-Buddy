import type { ReactNode } from 'react'

/** Wraps every [start, end) range of text in a highlight span. Ranges may overlap. */
export function highlight(text: string, ranges: [number, number][]): ReactNode[] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0])
  const out: ReactNode[] = []
  let pos = 0
  for (const [s, e] of sorted) {
    if (e <= pos) continue
    const from = Math.max(s, pos)
    if (from > pos) out.push(text.slice(pos, from))
    out.push(
      <mark key={from} className="hl">
        {text.slice(from, e)}
      </mark>,
    )
    pos = e
  }
  out.push(text.slice(pos))
  return out
}
