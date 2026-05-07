import { useCallback, useEffect, useRef, useState } from 'react'

/* SVG canvas: 360 × 260
   Nodes are absolutely positioned via inline % left/top.
   Tile is 44px square; (x,y) = tile center. */

const NODES = [
  { id: 'trigger',  x:  50, y:  55, title: 'Trigger',    type: 'trigger',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M12 9.5v3.5l2.2 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M9.5 3.2h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  { id: 'cv',       x: 215, y:  35, title: 'CV',         type: 'doc',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path d="M7 3.5h7l3.5 3.5V20.5H7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M14 3.5V7h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M9.5 12h5M9.5 15h5M9.5 18h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  { id: 'call',     x: 320, y: 130, title: 'Call',       type: 'call',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M14 10.5l5-2.5v8l-5-2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
  { id: 'decision', x: 165, y: 145, title: 'IF: match?', type: 'if',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path d="M12 3.5l8.5 8.5L12 20.5 3.5 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M12 8.5v4M12 15.7h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  { id: 'hire',     x:  85, y: 225, title: 'Hire',       type: 'success',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8.2 12.4l2.5 2.4 5-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

/* Main sequential paths — animate light-up on run.
   Each connects NODES[i] -> NODES[i+1] via a smooth bezier curve. */
const MAIN_PATHS = [
  // TR (50,55) -> CV (215,35)  : tile right-edge to tile left-edge, gentle s-curve
  'M 72 55 C 130 55, 165 35, 193 35',
  // CV (215,35) -> CALL (320,130) : down-right diagonal
  'M 237 35 C 285 45, 315 80, 320 108',
  // CALL (320,130) -> IF (165,145) : sweep left
  'M 298 130 C 250 138, 215 144, 187 145',
  // IF (165,145) -> HIRE (85,225) : down-left diagonal
  'M 165 167 C 155 195, 110 215, 85 203',
]

/* Background "spider web" — never animated, very faint, gives the
   organic networked look the user asked for. */
const SPIDER_PATHS = [
  // TR -> CALL : sweep above, behind everything
  'M 72 50 Q 200 10 320 115',
  // TR -> IF : down through middle-left
  'M 65 75 Q 100 120 150 138',
  // CV -> IF : down through middle
  'M 215 57 Q 195 95 175 124',
  // CV -> HIRE : long diagonal across
  'M 215 57 Q 130 150 95 207',
  // CALL -> HIRE : long sweep along right + bottom
  'M 320 152 Q 250 215 110 228',
]

const STEP_MS = 600
const FINISH_HOLD_MS = 1500

export default function HeroWorkflow() {
  const [activeIdx, setActiveIdx]       = useState(-1)
  const [completedIdx, setCompletedIdx] = useState(-1)
  const [phase, setPhase]               = useState('idle')
  const timeouts = useRef([])
  const running = useRef(false)

  const clearAll = useCallback(() => {
    timeouts.current.forEach(t => clearTimeout(t))
    timeouts.current = []
  }, [])

  useEffect(() => clearAll, [clearAll])

  const run = useCallback(() => {
    if (running.current) return
    running.current = true
    clearAll()
    setPhase('running')
    setCompletedIdx(-1)
    setActiveIdx(0)

    NODES.forEach((_, i) => {
      timeouts.current.push(setTimeout(() => setActiveIdx(i), i * STEP_MS))
      if (i > 0) {
        timeouts.current.push(setTimeout(() => setCompletedIdx(i - 1), i * STEP_MS))
      }
    })

    timeouts.current.push(setTimeout(() => {
      setCompletedIdx(NODES.length - 1)
      setPhase('finished')
    }, NODES.length * STEP_MS))

    timeouts.current.push(setTimeout(() => {
      setPhase('idle')
      setActiveIdx(-1)
      setCompletedIdx(-1)
      running.current = false
    }, NODES.length * STEP_MS + FINISH_HOLD_MS))
  }, [clearAll])

  return (
    <div className="n8n-flow">
      <div className="n8n-flow-toolbar">
        <button
          className={`n8n-run-btn n8n-run-btn--${phase}`}
          onClick={run}
          disabled={phase === 'running'}
          aria-label="Run workflow"
        >
          {phase === 'finished' ? (
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none" aria-hidden="true">
              <path d="M2.5 6.2l2.5 2.3 5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" width="9" height="9" fill="currentColor" aria-hidden="true">
              <path d="M2 1.5v9l8-4.5z"/>
            </svg>
          )}
          <span>
            {phase === 'idle'     && 'Run'}
            {phase === 'running'  && 'Running…'}
            {phase === 'finished' && 'Done'}
          </span>
        </button>
      </div>

      <div className="n8n-canvas">
        <svg
          className="n8n-paths"
          viewBox="0 0 360 260"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* spider web — always visible, very faint */}
          {SPIDER_PATHS.map((d, i) => (
            <path
              key={`s-${i}`}
              d={d}
              className="n8n-path-bg"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            />
          ))}
          {/* main sequence — light up step by step */}
          {MAIN_PATHS.map((d, i) => (
            <path
              key={`m-${i}`}
              d={d}
              className={`n8n-path ${i <= completedIdx ? 'n8n-path--lit' : ''}`}
              style={{ animationDelay: `${0.55 + i * 0.1}s` }}
            />
          ))}
        </svg>

        {NODES.map((node, i) => {
          const isActive    = i === activeIdx && phase !== 'finished'
          const isCompleted = i <= completedIdx
          const stateClass =
            isActive    ? 'n8n-node--active'    :
            isCompleted ? 'n8n-node--completed' :
                          ''

          return (
            <div
              key={node.id}
              className={`n8n-node n8n-node--${node.type} ${stateClass} n8n-node--label-bottom`}
              style={{
                left: `${(node.x / 360) * 100}%`,
                top:  `${(node.y / 260) * 100}%`,
                animationDelay: `${0.4 + i * 0.13}s`,
              }}
            >
              <div className="n8n-node-tile" aria-hidden="true">{node.icon}</div>
              <span className="n8n-node-title">{node.title}</span>
            </div>
          )
        })}
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {phase === 'running'  && 'Workflow w toku'}
        {phase === 'finished' && 'Workflow zakończony'}
      </span>
    </div>
  )
}
