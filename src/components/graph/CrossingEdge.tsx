import { arcPath, arcPathWithGap, overlapXRange, type Point } from '../../logic/graphAnalysis'
import { EdgeVisual, type EdgeVisualState } from './Edge'

interface CrossingPairProps {
  over: { p0: Point; p2: Point; bend: number; state: EdgeVisualState; onSelect: () => void; disabled?: boolean }
  under: { p0: Point; p2: Point; bend: number; state: EdgeVisualState; onSelect: () => void; disabled?: boolean }
}

/**
 * Renders a crossing pair (e.g. B-D over C-E) as two arcs with a circuit-trace
 * "hop": the under-arc gets a stroke gap where the over-arc passes above it,
 * so the crossing never reads as a false intersection/node (Section 5.2/7.6).
 */
export function CrossingEdgePair({ over, under }: CrossingPairProps) {
  const overlap = overlapXRange(over.p0, over.p2, under.p0, under.p2)
  const gapWidth = overlap ? (overlap.end - overlap.start) * 0.9 : 0
  const gapCenterX = overlap ? (overlap.start + overlap.end) / 2 : (under.p0.x + under.p2.x) / 2
  const gapHalfWidth = Math.max(gapWidth / 2, 18)

  const overD = arcPath(over.p0, over.p2, over.bend)
  const { before, after } = arcPathWithGap(under.p0, under.p2, under.bend, gapCenterX, gapHalfWidth)

  return (
    <>
      <EdgeVisual d={before} state={under.state} onSelect={under.onSelect} disabled={under.disabled} />
      <EdgeVisual d={after} state={under.state} onSelect={under.onSelect} disabled={under.disabled} />
      <EdgeVisual d={overD} state={over.state} onSelect={over.onSelect} disabled={over.disabled} />
    </>
  )
}
