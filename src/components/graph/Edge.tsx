import { useRef } from 'react'
import { useEdgeTransition } from '../../animation/useEdgeTransition'
import type { Point } from '../../logic/graphAnalysis'

export type EdgeVisualState = 'idle' | 'legal' | 'traversed'

const STATE_STYLE: Record<EdgeVisualState, { stroke: string; width: number; filter: string; className: string }> = {
  idle: {
    stroke: 'var(--color-cyan-dim)',
    width: 3,
    filter: 'none',
    className: 'opacity-60',
  },
  legal: {
    stroke: 'var(--color-magenta)',
    width: 4,
    filter: 'url(#glow-magenta)',
    className: 'edge-pulse-legal',
  },
  traversed: {
    stroke: 'var(--color-gold)',
    width: 4.5,
    filter: 'url(#glow-gold)',
    className: 'opacity-100',
  },
}

interface EdgeVisualProps {
  d: string
  state: EdgeVisualState
  onSelect: () => void
  disabled?: boolean
}

/** Renders one path fragment: the thin visible neon trace plus a fat invisible hit-path (Section 7.4). */
export function EdgeVisual({ d, state, onSelect, disabled }: EdgeVisualProps) {
  const style = STATE_STYLE[state]
  const visibleRef = useRef<SVGPathElement>(null)
  useEdgeTransition(visibleRef, state)

  return (
    <g
      className={disabled ? 'cursor-default' : 'cursor-pointer'}
      onPointerDown={(e) => {
        if (disabled) return
        e.stopPropagation()
        onSelect()
      }}
    >
      <path d={d} stroke="transparent" strokeWidth={28} fill="none" pointerEvents="stroke" />
      <path
        ref={visibleRef}
        d={d}
        stroke={style.stroke}
        strokeWidth={style.width}
        fill="none"
        strokeLinecap="round"
        filter={style.filter === 'none' ? undefined : style.filter}
        className={style.className}
        pointerEvents="none"
      />
    </g>
  )
}

export function straightPath(p0: Point, p2: Point): string {
  return `M ${p0.x} ${p0.y} L ${p2.x} ${p2.y}`
}
