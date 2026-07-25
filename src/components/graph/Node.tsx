import type { Point } from '../../logic/graphAnalysis'

export type NodeVisualState = 'idle' | 'visited' | 'legal' | 'current'

const STATE_STYLE: Record<
  NodeVisualState,
  { stroke: string; fill: string; filter: string; ringClass: string; radius: number }
> = {
  idle: {
    stroke: 'var(--color-cyan-dim)',
    fill: 'var(--color-void-2)',
    filter: 'url(#glow-soft)',
    ringClass: 'node-pulse-idle',
    radius: 20,
  },
  visited: {
    stroke: 'var(--color-gold-dim)',
    fill: 'color-mix(in srgb, var(--color-gold) 25%, var(--color-void-2))',
    filter: 'url(#glow-gold)',
    ringClass: 'opacity-90',
    radius: 20,
  },
  legal: {
    stroke: 'var(--color-magenta)',
    fill: 'var(--color-void-2)',
    filter: 'url(#glow-magenta)',
    ringClass: 'node-pulse-legal',
    radius: 22,
  },
  current: {
    stroke: 'var(--color-gold)',
    fill: 'color-mix(in srgb, var(--color-gold) 45%, var(--color-void-2))',
    filter: 'url(#glow-gold)',
    ringClass: 'node-pulse-current',
    radius: 24,
  },
}

interface NodeProps {
  id: string
  point: Point
  state: NodeVisualState
  onSelect: (id: string) => void
  disabled?: boolean
}

export function GraphNode({ id, point, state, onSelect, disabled }: NodeProps) {
  const style = STATE_STYLE[state]

  return (
    <g
      role="button"
      aria-label={`Node ${id}`}
      aria-disabled={disabled}
      className={disabled ? 'cursor-default' : 'cursor-pointer'}
      onPointerDown={(e) => {
        if (disabled) return
        e.stopPropagation()
        onSelect(id)
      }}
    >
      {/* Invisible, generously-sized hit target (Section 7.4) */}
      <circle cx={point.x} cy={point.y} r={34} fill="transparent" />

      <circle
        cx={point.x}
        cy={point.y}
        r={style.radius}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={2.5}
        filter={style.filter}
        className={style.ringClass}
      />

      <text
        x={point.x}
        y={point.y}
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none font-display text-[15px] font-bold"
        fill="#eaf7ff"
        style={{ pointerEvents: 'none' }}
      >
        {id}
      </text>
    </g>
  )
}
