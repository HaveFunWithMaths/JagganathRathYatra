import { forwardRef } from 'react'
import type { Point } from '../../logic/graphAnalysis'

interface AvatarProps {
  point: Point
  diameter?: number
  celebrating?: boolean
  stuck?: boolean
}

/**
 * The Jagannath avatar token. The provided artwork is a square illustration on
 * a starfield background, not native cyberpunk art — circular-clip it and add
 * a neon rim-light glow so it reads as an in-world terminal token rather than
 * a pasted image (Section 3). `point` sets resting position each render; the
 * GSAP motion hook takes over the same ref's transform during a move.
 */
export const Avatar = forwardRef<SVGGElement, AvatarProps>(function Avatar(
  { point, diameter = 56, celebrating, stuck },
  ref,
) {
  const r = diameter / 2

  return (
    <g ref={ref} transform={`translate(${point.x}, ${point.y})`}>
      <circle
        r={r + 6}
        fill="none"
        stroke={stuck ? 'var(--color-danger)' : 'var(--color-cyan)'}
        strokeWidth={2.5}
        filter={stuck ? 'url(#glow-danger)' : 'url(#glow-cyan)'}
        className={celebrating ? '' : 'node-pulse-current'}
      />
      <svg x={-r} y={-r} width={diameter} height={diameter} viewBox="0 0 100 100">
        <image
          href="/assets/jagannath-avatar.jpg"
          x={0}
          y={0}
          width={100}
          height={100}
          clipPath="url(#avatar-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </g>
  )
})
