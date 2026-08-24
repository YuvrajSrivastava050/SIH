'use client'

import { useEffect, useRef } from 'react'

interface TerrainBackgroundProps {
  /** 'full' renders the deep-teal backdrop + grid; 'map' is transparent (for embedding inside cards) */
  variant?: 'full' | 'map'
  /** enable subtle 3D tilt following the cursor (left/right) */
  tilt?: boolean
  /** multiplier for particles / scratches */
  density?: number
  /** when set, this image is the backdrop and the canvas only draws the live scratches/particles on top */
  imageSrc?: string
  className?: string
}

/* Simplified India silhouette in a 400 × 460 coordinate space */
const INDIA_PATH =
  'M191 12 C200 6 212 6 220 14 L227 30 L243 37 L257 51 L254 66 L275 64 ' +
  'L305 71 L325 83 L333 77 L347 88 L367 83 L383 95 L376 111 L358 115 ' +
  'L347 129 L333 143 L325 161 L315 175 L317 189 L305 183 L299 167 ' +
  'L291 149 L279 141 L271 155 L277 175 L271 195 L259 213 L245 239 ' +
  'L233 267 L221 297 L211 329 L203 361 L197 395 L192 427 L186 431 ' +
  'L181 399 L175 367 L167 335 L158 303 L150 273 L143 247 L136 227 ' +
  'L124 215 L114 211 L104 217 L96 209 L104 199 L98 189 L86 183 ' +
  'L76 173 L80 159 L92 151 L100 135 L96 119 L104 103 L98 87 L108 71 ' +
  'L120 59 L134 47 L148 39 L162 31 L176 23 Z'

interface Streak {
  x: number; y: number; len: number; angle: number
  speed: number; depth: number; alpha: number; hue: number; width: number
}
interface Dot {
  x: number; y: number; r: number; depth: number
  drift: number; phase: number; alpha: number; white: boolean
}

export default function TerrainBackground({
  variant = 'full',
  tilt = false,
  density = 1,
  imageSrc,
  className = '',
}: TerrainBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let W = 0, H = 0, dpr = 1
    // smoothed cursor state, normalised to [-1, 1] around element centre
    const mouse = { x: 0, y: 0, sx: 0, sy: 0, px: 0.5, py: 0.42, active: false }
    let streaks: Streak[] = []
    let dots: Dot[] = []
    const staticLayer = document.createElement('canvas')
    const sctx = staticLayer.getContext('2d')

    /* ---------- deterministic pseudo-random ---------- */
    let seed = 1337
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    /* ---------- build the static terrain layer ---------- */
    const buildStatic = () => {
      if (!sctx) return
      if (imageSrc) return // image mode: backdrop comes from the <img/> layer
      staticLayer.width = W * dpr
      staticLayer.height = H * dpr
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sctx.clearRect(0, 0, W, H)

      const mapH = H * (variant === 'full' ? 0.82 : 0.9)
      const mapW = mapH * (400 / 460)
      const mx = (W - mapW) / 2
      const my = (H - mapH) / 2
      const scale = mapH / 460

      const path = new Path2D(INDIA_PATH)

      /* sample interior network nodes in path-local space (identity transform
         so isPointInPath behaves consistently across browsers) */
      const pts: { x: number; y: number }[] = []
      {
        let guard = 0
        sctx.save()
        sctx.setTransform(1, 0, 0, 1, 0, 0)
        while (pts.length < 46 && guard < 900) {
          guard++
          const px = rand() * 400
          const py = rand() * 460
          if (sctx.isPointInPath(path, px, py)) pts.push({ x: px, y: py })
        }
        sctx.restore()
      }

      sctx.save()
      sctx.translate(mx, my)
      sctx.scale(scale, scale)

      /* backdrop */
      if (variant === 'full') {
        const bg = sctx.createLinearGradient(0, -my, 0, H - my)
        bg.addColorStop(0, '#04202e')
        bg.addColorStop(0.45, '#03141f')
        bg.addColorStop(1, '#010a11')
        sctx.fillStyle = bg
        sctx.fillRect(-mx, -my, W, H)

        // ambient glow behind the map
        const glow = sctx.createRadialGradient(200, 190, 20, 200, 190, 340)
        glow.addColorStop(0, 'rgba(45,212,255,0.17)')
        glow.addColorStop(0.5, 'rgba(34,197,240,0.07)')
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        sctx.fillStyle = glow
        sctx.fillRect(-mx, -my, W, H)

        // grid
        sctx.strokeStyle = 'rgba(90,200,255,0.055)'
        sctx.lineWidth = 1
        const step = 64
        sctx.beginPath()
        for (let gx = -mx; gx <= W - mx; gx += step) {
          sctx.moveTo(gx, -my); sctx.lineTo(gx, H - my)
        }
        for (let gy = -my; gy <= H - my; gy += step) {
          sctx.moveTo(-mx, gy); sctx.lineTo(W - mx, gy)
        }
        sctx.stroke()
      }

      /* map fill */
      const fill = sctx.createLinearGradient(0, 0, 0, 460)
      fill.addColorStop(0, 'rgba(56,220,255,0.16)')
      fill.addColorStop(0.55, 'rgba(38,205,245,0.08)')
      fill.addColorStop(1, 'rgba(30,190,235,0.03)')
      sctx.fillStyle = fill
      sctx.fill(path)

      /* inner circuit network (clipped to the map) */
      sctx.save()
      sctx.clip(path)

      sctx.strokeStyle = 'rgba(125,231,255,0.12)'
      sctx.lineWidth = 0.8
      sctx.beginPath()
      pts.forEach((a, i) => {
        pts.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 95) { sctx.moveTo(a.x, a.y); sctx.lineTo(b.x, b.y) }
        })
      })
      sctx.stroke()

      pts.forEach((p, i) => {
        const r = i % 7 === 0 ? 2.4 : 1.3
        sctx.fillStyle = i % 7 === 0 ? 'rgba(210,245,255,0.95)' : 'rgba(140,230,255,0.55)'
        sctx.beginPath()
        sctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        sctx.fill()
        if (i % 7 === 0) {
          const ring = sctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, 14)
          ring.addColorStop(0, 'rgba(140,230,255,0.35)')
          ring.addColorStop(1, 'rgba(140,230,255,0)')
          sctx.fillStyle = ring
          sctx.beginPath()
          sctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
          sctx.fill()
        }
      })
      sctx.restore()

      /* glowing outline */
      sctx.shadowColor = 'rgba(56,214,255,0.9)'
      sctx.shadowBlur = 26
      sctx.strokeStyle = 'rgba(140,235,255,0.85)'
      sctx.lineWidth = 1.6
      sctx.stroke(path)
      sctx.shadowBlur = 60
      sctx.strokeStyle = 'rgba(56,214,255,0.35)'
      sctx.stroke(path)
      sctx.shadowBlur = 0

      sctx.restore()

      /* vignette for the full variant */
      if (variant === 'full') {
        const vig = sctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75)
        vig.addColorStop(0, 'rgba(0,0,0,0)')
        vig.addColorStop(1, 'rgba(1,7,12,0.75)')
        sctx.fillStyle = vig
        sctx.fillRect(0, 0, W, H)
      }
    }

    /* ---------- particles ---------- */
    const spawn = () => {
      const nS = Math.round((W * H) / 34000 * density)
      const nD = Math.round((W * H) / 22000 * density)
      streaks = Array.from({ length: nS }, () => ({
        x: rand() * W,
        y: rand() * H,
        len: 26 + rand() * 90,
        angle: (-35 + rand() * 50) * (Math.PI / 180) * (rand() > 0.5 ? 1 : -1),
        speed: 0.12 + rand() * 0.5,
        depth: 0.25 + rand() * 0.75,
        alpha: 0.12 + rand() * 0.4,
        hue: rand(),
        width: rand() > 0.8 ? 1.6 : 1,
      }))
      dots = Array.from({ length: nD }, () => ({
        x: rand() * W,
        y: rand() * H,
        r: 0.6 + rand() * 1.8,
        depth: 0.2 + rand() * 0.8,
        drift: 0.08 + rand() * 0.25,
        phase: rand() * Math.PI * 2,
        alpha: 0.2 + rand() * 0.5,
        white: rand() > 0.72,
      }))
    }

    /* ---------- resize ---------- */
    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(1, Math.round(rect.width))
      H = Math.max(1, Math.round(rect.height))
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStatic()
      spawn()
      if (reduced) drawFrame(0) // single static frame
    }

    /* ---------- frame ---------- */
    let t = 0
    const drawFrame = (dt: number) => {
      t += dt
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'

      // static terrain with a whisper of counter-parallax (skipped in image mode)
      if (!imageSrc) ctx.drawImage(staticLayer, -mouse.sx * 7, -mouse.sy * 5, W, H)

      ctx.globalCompositeOperation = 'lighter'

      // cursor light orb (full backdrop only)
      if (variant === 'full' && mouse.active) {
        const ox = mouse.px * W
        const oy = mouse.py * H
        const orb = ctx.createRadialGradient(ox, oy, 0, ox, oy, 120)
        orb.addColorStop(0, 'rgba(150,235,255,0.075)')
        orb.addColorStop(0.5, 'rgba(80,200,255,0.03)')
        orb.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = orb
        ctx.fillRect(ox - 120, oy - 120, 240, 240)
      }

      // scratches / light streaks
      for (const s of streaks) {
        s.x += Math.cos(s.angle) * s.speed * dt * 60
        s.y += Math.sin(s.angle) * s.speed * dt * 60
        if (s.x < -140) s.x = W + 120
        if (s.x > W + 140) s.x = -120
        if (s.y < -140) s.y = H + 120
        if (s.y > H + 140) s.y = -120

        const px = s.x + mouse.sx * 46 * s.depth
        const py = s.y + mouse.sy * 30 * s.depth
        const dx = Math.cos(s.angle) * s.len
        const dy = Math.sin(s.angle) * s.len
        const grad = ctx.createLinearGradient(px - dx, py - dy, px + dx, py + dy)
        const col = s.hue > 0.6 ? '190,240,255' : '80,215,255'
        grad.addColorStop(0, `rgba(${col},0)`)
        grad.addColorStop(0.5, `rgba(${col},${s.alpha})`)
        grad.addColorStop(1, `rgba(${col},0)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = s.width
        ctx.beginPath()
        ctx.moveTo(px - dx, py - dy)
        ctx.lineTo(px + dx, py + dy)
        ctx.stroke()
      }

      // drifting dots
      for (const d of dots) {
        d.y -= d.drift * dt * 60
        if (d.y < -8) { d.y = H + 8; d.x = rand() * W }
        const tw = 0.55 + 0.45 * Math.sin(t * 2 + d.phase)
        const px = d.x + mouse.sx * 60 * d.depth
        const py = d.y + mouse.sy * 40 * d.depth
        ctx.fillStyle = d.white
          ? `rgba(235,250,255,${d.alpha * tw})`
          : `rgba(96,220,255,${d.alpha * tw})`
        ctx.beginPath()
        ctx.arc(px, py, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
    }

    /* ---------- main loop: smooth cursor + tilt ---------- */
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      mouse.sx += (mouse.x - mouse.sx) * 0.055
      mouse.sy += (mouse.y - mouse.sy) * 0.055

      drawFrame(dt)

      if (tilt) {
        const ry = mouse.sx * 4.2   // left/right tilt
        const rx = -mouse.sy * 2.4  // gentle up/down accompany
        wrap.style.transform = `perspective(1200px) rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg) scale(1.03)`
      }

      raf = requestAnimationFrame(loop)
    }

    /* ---------- events ---------- */
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      mouse.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)))
      mouse.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)))
      mouse.px = (e.clientX - rect.left) / rect.width
      mouse.py = (e.clientY - rect.top) / rect.height
      mouse.active = true
    }
    const onLeave = () => {
      mouse.x = 0
      mouse.y = 0
      mouse.active = false
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    if (!reduced) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [variant, tilt, density, imageSrc])

  return (
    <div
      ref={wrapRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
      aria-hidden="true"
    >
      {imageSrc && (
        <div
          className="absolute inset-0 z-0 opacity-100"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 block" />
      {imageSrc && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 48%, rgba(2,10,18,0.18) 100%)',
          }}
        />
      )}
    </div>
  )
}
