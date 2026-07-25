import { useEffect, useMemo, useRef } from 'react'
import { useAvatarMotion } from '../../animation/useAvatarMotion'
import { buildHistoryPath, playDeadEndSequence, playVictorySequence, resetGraphVisuals } from '../../animation/sequences'
import type { Level, LevelEdge } from '../../levels'
import { useGameStore } from '../../state/gameStore'
import { useCurrentLevel, useLegalMoves, useVisitedNodes } from '../../state/selectors'
import { SvgFilters } from '../fx/SvgFilters'
import { Avatar } from './Avatar'
import { getViewBoxConfig, nodePointMap, type ViewBoxConfig } from './coords'
import { CrossingEdgePair } from './CrossingEdge'
import { EdgeVisual, straightPath, type EdgeVisualState } from './Edge'
import { GraphNode, type NodeVisualState } from './Node'
import { PanZoomContainer } from './PanZoomContainer'

interface CrossingPair {
  over: LevelEdge
  under: LevelEdge
}

function getCrossingPairs(level: Level): CrossingPair[] {
  const byRow = new Map<number, LevelEdge[]>()
  for (const edge of level.edges) {
    if (!edge.crossing) continue
    const rowY = level.nodes.find((n) => n.id === edge.a)?.normY ?? 0
    const arr = byRow.get(rowY) ?? []
    arr.push(edge)
    byRow.set(rowY, arr)
  }
  const pairs: CrossingPair[] = []
  for (const arr of byRow.values()) {
    const over = arr.find((e) => e.crossing?.role === 'over')
    const under = arr.find((e) => e.crossing?.role === 'under')
    if (over && under) pairs.push({ over, under })
  }
  return pairs
}

interface GraphCanvasProps {
  panZoomEnabled?: boolean
  className?: string
  onSequenceComplete?: () => void
}

export function GraphCanvas({ panZoomEnabled = false, className, onSequenceComplete }: GraphCanvasProps) {
  const level = useCurrentLevel()
  const phase = useGameStore((s) => s.phase)
  const currentNode = useGameStore((s) => s.currentNode)
  const traversed = useGameStore((s) => s.traversed)
  const history = useGameStore((s) => s.history)
  const beginMove = useGameStore((s) => s.beginMove)
  const selectStartNode = useGameStore((s) => s.selectStartNode)
  const legalMoves = useLegalMoves()
  const visitedNodes = useVisitedNodes()
  const avatarRef = useRef<SVGGElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pulseDotRef = useRef<SVGCircleElement>(null)

  const cfg: ViewBoxConfig | null = level ? getViewBoxConfig(level.id) : null
  useAvatarMotion(avatarRef, level, cfg)

  const points = useMemo(() => (level && cfg ? nodePointMap(level, cfg) : null), [level, cfg])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !cfg) return

    if (phase === 'victory' && level && points && avatarRef.current && pulseDotRef.current) {
      const historyPath = buildHistoryPath(level, cfg, history)
      const tl = playVictorySequence({
        svg,
        pulseDot: pulseDotRef.current,
        avatar: avatarRef.current,
        historyPath,
        onComplete: () => onSequenceComplete?.(),
      })
      return () => {
        tl.kill()
      }
    }

    if (phase === 'deadEnd' && currentNode && points) {
      const stuckPoint = points.get(currentNode)
      if (stuckPoint) {
        const tl = playDeadEndSequence({
          svg,
          stuckPoint,
          baseViewBox: cfg,
          onComplete: () => onSequenceComplete?.(),
        })
        return () => {
          tl.kill()
        }
      }
    }

    resetGraphVisuals(svg, cfg)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  if (!level || !cfg || !points) return null

  const legalTargets = new Map(legalMoves.map((m) => [m.other, m.edge.id]))
  const inputLocked = phase === 'animating'

  function nodeState(id: string): NodeVisualState {
    if (id === currentNode) return 'current'
    // Section 1: the player picks any node to start — which nodes actually
    // work is part of the puzzle, so nothing is hinted before the first move.
    if (phase === 'awaitStart') return 'idle'
    if (legalTargets.has(id)) return 'legal'
    if (visitedNodes.has(id)) return 'visited'
    return 'idle'
  }

  function nodeDisabled(id: string): boolean {
    if (phase === 'awaitStart') return false
    if (phase !== 'playing') return true
    return !legalTargets.has(id)
  }

  function edgeState(edge: LevelEdge): EdgeVisualState {
    if (traversed.has(edge.id)) return 'traversed'
    if (phase === 'playing' && legalTargets.get(edge.a) === edge.id) return 'legal'
    if (phase === 'playing' && legalTargets.get(edge.b) === edge.id) return 'legal'
    return 'idle'
  }

  function edgeOtherEnd(edge: LevelEdge): string | null {
    if (currentNode === edge.a) return edge.b
    if (currentNode === edge.b) return edge.a
    return null
  }

  function handleNodeSelect(id: string) {
    if (inputLocked) return
    if (phase === 'awaitStart') {
      selectStartNode(id)
      return
    }
    if (phase === 'playing') beginMove(id)
  }

  function handleEdgeSelect(edge: LevelEdge) {
    if (inputLocked || phase !== 'playing') return
    const other = edgeOtherEnd(edge)
    if (other) beginMove(other)
  }

  const crossingPairs = getCrossingPairs(level)
  const crossingIds = new Set(crossingPairs.flatMap((p) => [p.over.id, p.under.id]))
  const plainEdges = level.edges.filter((e) => !crossingIds.has(e.id))

  const currentPoint = currentNode ? points.get(currentNode) : undefined

  return (
    <PanZoomContainer enabled={panZoomEnabled} className={className}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${cfg.width} ${cfg.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        <SvgFilters />

        {plainEdges.map((edge) => (
          <EdgeVisual
            key={edge.id}
            d={straightPath(points.get(edge.a)!, points.get(edge.b)!)}
            state={edgeState(edge)}
            disabled={inputLocked || phase !== 'playing' || !edgeOtherEnd(edge)}
            onSelect={() => handleEdgeSelect(edge)}
          />
        ))}

        {crossingPairs.map((pair) => (
          <CrossingEdgePair
            key={pair.over.id + pair.under.id}
            over={{
              p0: points.get(pair.over.a)!,
              p2: points.get(pair.over.b)!,
              bend: pair.over.crossing!.bend * (cfg.height - 2 * cfg.padY),
              state: edgeState(pair.over),
              disabled: inputLocked || phase !== 'playing' || !edgeOtherEnd(pair.over),
              onSelect: () => handleEdgeSelect(pair.over),
            }}
            under={{
              p0: points.get(pair.under.a)!,
              p2: points.get(pair.under.b)!,
              bend: pair.under.crossing!.bend * (cfg.height - 2 * cfg.padY),
              state: edgeState(pair.under),
              disabled: inputLocked || phase !== 'playing' || !edgeOtherEnd(pair.under),
              onSelect: () => handleEdgeSelect(pair.under),
            }}
          />
        ))}

        {level.nodes.map((node) => (
          <GraphNode
            key={node.id}
            id={node.id}
            point={points.get(node.id)!}
            state={nodeState(node.id)}
            disabled={nodeDisabled(node.id)}
            onSelect={handleNodeSelect}
          />
        ))}

        {currentPoint && (
          <Avatar
            ref={avatarRef}
            point={currentPoint}
            celebrating={phase === 'victory'}
            stuck={phase === 'deadEnd'}
          />
        )}

        <circle ref={pulseDotRef} r={10} fill="var(--color-gold)" filter="url(#glow-gold)" opacity={0} />
      </svg>
    </PanZoomContainer>
  )
}
