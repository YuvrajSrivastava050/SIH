'use client'

import { useEffect, useRef } from 'react'

/**
 * Soft white glow that trails the cursor across the whole app.
 * Rendered as a fixed, non-interactive layer using screen blending.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // skip on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { ...pos }
    let visible = false

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        el.style.opacity = '1'
      }
    }
    const onLeave = () => {
      visible = false
      el.style.opacity = '0'
    }

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.12
      pos.y += (target.y - pos.y) * 0.12
      el.style.transform = `translate3d(${(pos.x - 300).toFixed(1)}px, ${(pos.y - 300).toFixed(1)}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background:
          'radial-gradient(circle, rgba(255,255,255,0.075) 0%, rgba(190,235,255,0.045) 30%, rgba(140,215,255,0.02) 55%, transparent 72%)',
        mixBlendMode: 'screen',
        willChange: 'transform',
      }}
    />
  )
}