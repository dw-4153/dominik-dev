import { useEffect, useRef } from 'react'

/* Subtle neural-mesh background layer. Toned-down twin of the
   earlier preview — fewer particles, lower opacity, project-cyan
   only, no mouse interaction. Optimised for production:
   - bucketed stroke() calls (1 per alpha-bucket, not per line)
   - debounced resize
   - paused when tab is hidden
   - respects prefers-reduced-motion (one static frame) */

const CYAN = { r: 0, g: 212, b: 255 }
const MAX_DIST = 130
const ALPHA_BUCKETS = 8 // group lines by 8 discrete alpha levels

export default function NeuralLayer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let w = 0
    let h = 0
    let particles = []
    let resizeTimer = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile = w < 640
      const density = isMobile ? 22000 : 16000
      const cap = isMobile ? 28 : 60
      const target = Math.min(cap, Math.floor((w * h) / density))
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }))
    }

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }

    resize()
    window.addEventListener('resize', onResize)

    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h)

      // Bucket lines by alpha (0..ALPHA_BUCKETS-1). One stroke() per bucket.
      const buckets = Array.from({ length: ALPHA_BUCKETS }, () => [])

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < MAX_DIST * MAX_DIST) {
            const t = 1 - Math.sqrt(d2) / MAX_DIST
            const bucket = Math.min(ALPHA_BUCKETS - 1, Math.floor(t * ALPHA_BUCKETS))
            buckets[bucket].push(a.x, a.y, b.x, b.y)
          }
        }
      }

      ctx.lineWidth = 0.5
      for (let k = 0; k < ALPHA_BUCKETS; k++) {
        const list = buckets[k]
        if (!list.length) continue
        const alpha = ((k + 0.5) / ALPHA_BUCKETS) * 0.14
        ctx.strokeStyle = `rgba(${CYAN.r}, ${CYAN.g}, ${CYAN.b}, ${alpha})`
        ctx.beginPath()
        for (let p = 0; p < list.length; p += 4) {
          ctx.moveTo(list[p], list[p + 1])
          ctx.lineTo(list[p + 2], list[p + 3])
        }
        ctx.stroke()
      }

      ctx.fillStyle = `rgba(${CYAN.r}, ${CYAN.g}, ${CYAN.b}, 0.45)`
      ctx.beginPath()
      for (const p of particles) {
        ctx.moveTo(p.x + 1, p.y)
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2)
      }
      ctx.fill()
    }

    if (reduceMotion) {
      drawFrame()
      return () => {
        window.removeEventListener('resize', onResize)
        clearTimeout(resizeTimer)
      }
    }

    const tick = () => {
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > w) { p.x = w; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > h) { p.y = h; p.vy *= -1 }
      }
      drawFrame()
      raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (!raf) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      clearTimeout(resizeTimer)
    }
  }, [])

  return <canvas ref={canvasRef} className="neural-layer" aria-hidden="true" />
}
