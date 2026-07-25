import { useEffect } from 'react'
import { scaleBend, toPoint, type ViewBoxConfig } from '../components/graph/coords'
import type { Level } from '../levels'
import { arcControlPoint } from '../logic/graphAnalysis'
import { useGameStore } from '../state/gameStore'
import { gsap } from './gsap'

/**
 * Drives the avatar's traversal along an edge with GSAP MotionPathPlugin.
 * Crossing edges (Section 5.2) get a 3-point path through the same arc
 * control point used to render them, so the avatar visibly rides the curve
 * rather than cutting straight through the rendered "hop" gap.
 */
export function useAvatarMotion(
  avatarRef: React.RefObject<SVGGElement | null>,
  level: Level | null,
  cfg: ViewBoxConfig | null,
) {
  const phase = useGameStore((s) => s.phase)
  const pendingMove = useGameStore((s) => s.pendingMove)
  const completeMove = useGameStore((s) => s.completeMove)

  useEffect(() => {
    if (phase !== 'animating' || !pendingMove || !level || !cfg || !avatarRef.current) return

    const fromNode = level.nodes.find((n) => n.id === pendingMove.from)
    const toNode = level.nodes.find((n) => n.id === pendingMove.to)
    const edge = level.edges.find((e) => e.id === pendingMove.edgeId)
    if (!fromNode || !toNode) return

    const from = toPoint(fromNode, cfg)
    const to = toPoint(toNode, cfg)
    const path = edge?.crossing
      ? [from, arcControlPoint(from, to, scaleBend(edge.crossing.bend, cfg)), to]
      : [from, to]

    const tween = gsap.to(avatarRef.current, {
      duration: 0.48,
      ease: 'power2.inOut',
      motionPath: {
        path,
        curviness: edge?.crossing ? 1.25 : 0,
      },
      onComplete: () => completeMove(),
    })

    return () => {
      tween.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pendingMove, level, cfg])
}
