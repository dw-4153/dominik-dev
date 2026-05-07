import { useEffect, useRef } from 'react'

export default function AmbientLayer() {
  const layerRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      return () => { layer.innerHTML = '' }
    }

    const isMobile = window.innerWidth < 640

    // ── 1. VERTICAL COLUMN DIVIDERS (desktop only)
    if (!isMobile) {
      const colPositions = [22, 78]
      colPositions.forEach(x => {
        const el = document.createElement('div')
        el.className = 'amb-col-line'
        el.style.left = x + '%'
        layer.appendChild(el)
      })
    }

    // ── 2. 4-POINTED STARS
    const allStars = [
      { x: 18, y: 12, size: 16, dur: 8,  delay: 0   },
      { x: 74, y: 8,  size: 12, dur: 10, delay: 2.5 },
      { x: 88, y: 35, size: 14, dur: 9,  delay: 1   },
      { x: 8,  y: 55, size: 10, dur: 11, delay: 4   },
      { x: 62, y: 78, size: 16, dur: 8,  delay: 3   },
      { x: 30, y: 88, size: 12, dur: 12, delay: 1.5 },
    ]
    const stars = isMobile ? allStars.slice(0, 2) : allStars
    stars.forEach(({ x, y, size, dur, delay }) => {
      const el = document.createElement('div')
      el.className = 'amb-star'
      el.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:${delay}s`
      el.innerHTML = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0 C8 0 8.5 3.5 8 8 C7.5 3.5 8 0 8 0Z" fill="rgba(0,212,255,0.6)"/>
        <path d="M16 8 C16 8 12.5 8.5 8 8 C12.5 7.5 16 8 16 8Z" fill="rgba(0,212,255,0.6)"/>
        <path d="M8 16 C8 16 7.5 12.5 8 8 C8.5 12.5 8 16 8 16Z" fill="rgba(0,212,255,0.6)"/>
        <path d="M0 8 C0 8 3.5 7.5 8 8 C3.5 8.5 0 8 0 8Z" fill="rgba(0,212,255,0.6)"/>
      </svg>`
      layer.appendChild(el)
    })

    // ── 3. ASCII TEXT BLOCKS (desktop only)
    if (!isMobile) {
      const asciiBlocks = [
        { x: 3,  y: 18, lines: ['X XXXXXXX X', 'XXXXXXXXXX', 'XX XXXXXX', 'XXXXXXXXXX', 'X XXXXXXX X'],   dur: 22, delay: 0   },
        { x: 82, y: 22, lines: ['^^_^^ ^^', '"==^ +--', '+ ^^+--^', '"++==^_^'],                          dur: 18, delay: 5   },
        { x: 6,  y: 72, lines: ['XXXXXXXXXX', 'X XXXXXX X', 'XXXXXXXXXX'],                                dur: 25, delay: 8   },
        { x: 78, y: 68, lines: ['^^ ^_^  ^^', '"=+^  +--', '^^+--^_^'],                                   dur: 20, delay: 3   },
        { x: 48, y: 4,  lines: ['XXXXXXXXXX', 'XX XXXXX X', 'XXXXXXXXXX', 'X XXXXXX X'],                  dur: 24, delay: 11  },
      ]
      asciiBlocks.forEach(({ x, y, lines, dur, delay }) => {
        const el = document.createElement('div')
        el.className = 'amb-ascii'
        el.style.cssText = `left:${x}%;top:${y}%;animation-duration:${dur}s;animation-delay:${delay}s`
        el.innerHTML = lines.map(l => `<div>${l}</div>`).join('')
        layer.appendChild(el)
      })
    }

    // ── 4. SKELETON UI ELEMENTS (desktop only)
    if (!isMobile) {
      const skeletons = [
        {
          x: 8, y: 6, w: 260, h: 32,
          dur: 30, delay: 2,
          html: `<div class="sk-bar sk-wide"></div><div class="sk-bar sk-med" style="margin-left:auto"></div><div class="sk-bar sk-short"></div><div class="sk-bar sk-short"></div>`,
        },
        {
          x: 68, y: 44, w: 180, h: 80,
          dur: 26, delay: 7,
          html: `<div class="sk-bar sk-wide" style="margin-bottom:8px"></div><div class="sk-bar sk-med" style="margin-bottom:6px"></div><div class="sk-bar sk-wide"></div>`,
        },
        {
          x: 5, y: 44, w: 140, h: 80,
          dur: 28, delay: 14,
          html: `<div class="sk-bar sk-med" style="margin-bottom:8px"></div><div class="sk-bar sk-wide" style="margin-bottom:6px"></div><div class="sk-bar sk-short"></div>`,
        },
        {
          x: 74, y: 85, w: 120, h: 32,
          dur: 22, delay: 9,
          html: `<div class="sk-bar sk-wide"></div>`,
        },
      ]
      skeletons.forEach(({ x, y, w, h, dur, delay, html }) => {
        const el = document.createElement('div')
        el.className = 'amb-skeleton'
        el.style.cssText = `left:${x}%;top:${y}%;width:${w}px;height:${h}px;animation-duration:${dur}s;animation-delay:${delay}s`
        el.innerHTML = html
        layer.appendChild(el)
      })
    }

    // ── 5. DOT GRIDS
    const allDotGrids = [
      { x: 20, y: 38, cols: 4, rows: 4, dur: 18, delay: 1  },
      { x: 72, y: 15, cols: 3, rows: 3, dur: 14, delay: 6  },
      { x: 88, y: 72, cols: 4, rows: 3, dur: 20, delay: 10 },
      { x: 10, y: 80, cols: 3, rows: 4, dur: 16, delay: 4  },
    ]
    const dotGrids = isMobile ? allDotGrids.slice(0, 1) : allDotGrids
    dotGrids.forEach(({ x, y, cols, rows, dur, delay }) => {
      const el = document.createElement('div')
      el.className = 'amb-dots'
      el.style.cssText = `left:${x}%;top:${y}%;grid-template-columns:repeat(${cols},1fr);animation-duration:${dur}s;animation-delay:${delay}s`
      for (let i = 0; i < cols * rows; i++) {
        const dot = document.createElement('span')
        el.appendChild(dot)
      }
      layer.appendChild(el)
    })

    // ── 6. STATUS TAGS
    const allTags = [
      { x: 3,  y: 7,  text: '[ 200 OK ]',   dur: 20, delay: 0  },
      { x: 84, y: 5,  text: '[ SCRAPE ]',    dur: 17, delay: 6  },
      { x: 4,  y: 62, text: '[ .JSON ]',     dur: 22, delay: 3  },
      { x: 82, y: 58, text: '[ WEBHOOK ]',   dur: 19, delay: 9  },
      { x: 40, y: 92, text: '[ BUILD OK ]',  dur: 24, delay: 5  },
      { x: 60, y: 2,  text: '[ AGENT ]',     dur: 16, delay: 12 },
    ]
    const tags = isMobile ? allTags.slice(0, 2) : allTags
    tags.forEach(({ x, y, text, dur, delay }) => {
      const el = document.createElement('div')
      el.className = 'amb-tag'
      el.style.cssText = `left:${x}%;top:${y}%;animation-duration:${dur}s;animation-delay:${delay}s`
      el.textContent = text
      layer.appendChild(el)
    })

    return () => { layer.innerHTML = '' }
  }, [])

  return <div className="ambient-layer" ref={layerRef} />
}
