import { useEffect, useState, type RefObject } from 'react'

const MAX = 3.5 // pupil travel in SVG units

/**
 * Where the character's eyes should look: toward the finger/mouse,
 * or wandering around on its own when nobody interacts for a while.
 */
export function useLook(ref: RefObject<Element | null>, enabled: boolean) {
  const [look, setLook] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    let lastMove = 0

    const onMove = (e: PointerEvent) => {
      lastMove = Date.now()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 200)
        setLook({ x: (dx / d) * MAX * k, y: (dy / d) * MAX * k })
      })
    }

    // Idle: glance around every couple of seconds
    const wander = setInterval(() => {
      if (Date.now() - lastMove < 2500) return
      const a = Math.random() * Math.PI * 2
      const k = Math.random() < 0.35 ? 0 : Math.random()
      setLook({ x: Math.cos(a) * MAX * k, y: Math.sin(a) * MAX * k * 0.6 })
    }, 2200)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onMove)
    return () => {
      cancelAnimationFrame(frame)
      clearInterval(wander)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
    }
  }, [ref, enabled])

  return look
}
