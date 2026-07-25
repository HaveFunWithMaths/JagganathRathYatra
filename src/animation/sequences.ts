import { scaleBend, toPoint, type ViewBoxConfig } from '../components/graph/coords'
import type { Level } from '../levels'
import { arcControlPoint, type Point } from '../logic/graphAnalysis'
import type { Move } from '../state/types'
import { gsap } from './gsap'

/** Concatenates the run's traversed edges into one continuous point path, in order. */
export function buildHistoryPath(level: Level, cfg: ViewBoxConfig, history: Move[]): Point[] {
  const points: Point[] = []
  history.forEach((move, i) => {
    const fromNode = level.nodes.find((n) => n.id === move.from)
    const toNode = level.nodes.find((n) => n.id === move.to)
    if (!fromNode || !toNode) return
    const from = toPoint(fromNode, cfg)
    const to = toPoint(toNode, cfg)
    const edge = level.edges.find((e) => e.id === move.edgeId)
    if (i === 0) points.push(from)
    if (edge?.crossing) points.push(arcControlPoint(from, to, scaleBend(edge.crossing.bend, cfg)))
    points.push(to)
  })
  return points
}

/**
 * Victory beat (Section 7.5): warm palette shift, an energy pulse retracing
 * the completed path, and an avatar celebration pose — readable before any
 * text renders. Runs entirely in-graph; GameScreen reveals VictoryScreen once
 * this completes.
 */
export function playVictorySequence(opts: {
  svg: SVGSVGElement
  pulseDot: SVGCircleElement
  avatar: SVGGElement
  historyPath: Point[]
  onComplete: () => void
}) {
  const { svg, pulseDot, avatar, historyPath, onComplete } = opts
  const tl = gsap.timeline({ onComplete })

  tl.to(svg, { filter: 'saturate(1.4) brightness(1.15)', duration: 0.35 }, 0)

  if (historyPath.length >= 2) {
    tl.set(pulseDot, { opacity: 1, x: historyPath[0].x, y: historyPath[0].y })
    tl.to(
      pulseDot,
      {
        duration: Math.min(1.6, 0.12 * historyPath.length + 0.3),
        motionPath: { path: historyPath, curviness: 1 },
        ease: 'power1.inOut',
      },
      0.05,
    )
  }

  tl.to(avatar, { scale: 1.35, duration: 0.25, ease: 'back.out(3)', transformOrigin: '50% 50%' }, '-=0.3')
  tl.to(
    avatar,
    { rotation: 10, duration: 0.14, yoyo: true, repeat: 3, transformOrigin: '50% 50%' },
    '<',
  )
  tl.to(pulseDot, { opacity: 0, duration: 0.3 }, '-=0.1')

  return tl
}

/**
 * Dead-end beat (Section 7.5): camera zooms in tight on the stuck avatar,
 * cooler/red-tinted palette, and a glitch beat reads as "system error"
 * without needing text.
 */
export function playDeadEndSequence(opts: {
  svg: SVGSVGElement
  stuckPoint: Point
  baseViewBox: { width: number; height: number }
  onComplete: () => void
}) {
  const { svg, stuckPoint, baseViewBox, onComplete } = opts
  const box = { x: 0, y: 0, w: baseViewBox.width, h: baseViewBox.height }
  const zoomSize = Math.min(baseViewBox.width, baseViewBox.height) * 0.4
  const tl = gsap.timeline({ onComplete })

  tl.to(svg, { filter: 'saturate(0.2) brightness(0.8) hue-rotate(-8deg)', duration: 0.35 }, 0)
  tl.to(
    box,
    {
      x: stuckPoint.x - zoomSize / 2,
      y: stuckPoint.y - zoomSize / 2,
      w: zoomSize,
      h: zoomSize,
      duration: 0.85,
      ease: 'power2.inOut',
      onUpdate: () => svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`),
    },
    0.1,
  )
  tl.call(() => svg.classList.add('fx-glitch'), [], 0.55)
  tl.call(() => svg.classList.remove('fx-glitch'), [], 0.95)

  return tl
}

export function resetGraphVisuals(svg: SVGSVGElement, baseViewBox: { width: number; height: number }) {
  svg.setAttribute('viewBox', `0 0 ${baseViewBox.width} ${baseViewBox.height}`)
  gsap.set(svg, { filter: 'none' })
  svg.classList.remove('fx-glitch')
}
