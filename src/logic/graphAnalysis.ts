import { edgeId, type EdgeId, type Level, type LevelEdge, type NodeId } from '../levels/types'

export interface Adjacency {
  edge: LevelEdge
  other: NodeId
}

export function buildAdjacency(level: Level): Map<NodeId, Adjacency[]> {
  const map = new Map<NodeId, Adjacency[]>()
  for (const node of level.nodes) map.set(node.id, [])
  for (const edge of level.edges) {
    map.get(edge.a)?.push({ edge, other: edge.b })
    map.get(edge.b)?.push({ edge, other: edge.a })
  }
  return map
}

export function computeDegrees(level: Level): Record<NodeId, number> {
  const degrees: Record<NodeId, number> = {}
  for (const node of level.nodes) degrees[node.id] = 0
  for (const edge of level.edges) {
    degrees[edge.a]++
    degrees[edge.b]++
  }
  return degrees
}

export function oddDegreeNodes(level: Level): NodeId[] {
  const degrees = computeDegrees(level)
  return level.nodes.map((n) => n.id).filter((id) => degrees[id] % 2 !== 0)
}

export function isConnected(level: Level): boolean {
  if (level.nodes.length === 0) return true
  const adjacency = buildAdjacency(level)
  const seen = new Set<NodeId>()
  const stack = [level.nodes[0].id]
  while (stack.length) {
    const node = stack.pop()!
    if (seen.has(node)) continue
    seen.add(node)
    for (const { other } of adjacency.get(node) ?? []) {
      if (!seen.has(other)) stack.push(other)
    }
  }
  return seen.size === level.nodes.length
}

/** An Eulerian trail exists iff the graph is connected and has exactly 0 or 2 odd-degree nodes. */
export function hasEulerianTrail(level: Level): boolean {
  if (!isConnected(level)) return false
  const odd = oddDegreeNodes(level).length
  return odd === 0 || odd === 2
}

export function legalMoves(
  level: Level,
  currentNode: NodeId,
  traversed: ReadonlySet<EdgeId>,
): Adjacency[] {
  const adjacency = buildAdjacency(level)
  return (adjacency.get(currentNode) ?? []).filter((a) => !traversed.has(a.edge.id))
}

export function isVictory(level: Level, traversed: ReadonlySet<EdgeId>): boolean {
  return traversed.size === level.edges.length
}

export function isDeadEnd(
  level: Level,
  currentNode: NodeId,
  traversed: ReadonlySet<EdgeId>,
): boolean {
  if (isVictory(level, traversed)) return false
  return legalMoves(level, currentNode, traversed).length === 0
}

/**
 * Hierholzer's algorithm. Used only in tests to sanity-check that the
 * authored level data (Section 5) is actually solvable from its valid starts.
 */
export function findEulerianTrail(level: Level, start: NodeId): EdgeId[] | null {
  const totalEdges = level.edges.length
  if (totalEdges === 0) return []

  const adjacency = buildAdjacency(level)
  const pointer = new Map<NodeId, number>(level.nodes.map((n) => [n.id, 0]))
  const used = new Set<EdgeId>()

  const nodeStack: NodeId[] = [start]
  const circuit: NodeId[] = []

  while (nodeStack.length) {
    const v = nodeStack[nodeStack.length - 1]
    const neighbors = adjacency.get(v) ?? []
    let p = pointer.get(v)!
    let advanced = false
    while (p < neighbors.length) {
      const { edge, other } = neighbors[p]
      p++
      if (used.has(edge.id)) continue
      used.add(edge.id)
      nodeStack.push(other)
      advanced = true
      break
    }
    pointer.set(v, p)
    if (!advanced) circuit.push(nodeStack.pop()!)
  }

  if (used.size !== totalEdges) return null

  const trailNodes = circuit.reverse()
  const edges: EdgeId[] = []
  for (let i = 0; i < trailNodes.length - 1; i++) {
    edges.push(edgeId(trailNodes[i], trailNodes[i + 1]))
  }
  return edges
}

// --- Crossing-edge geometry (Section 5.2 / 7.6) ---------------------------

export interface Point {
  x: number
  y: number
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

/** Control point for a quadratic arc whose x-midpoint equals the chord's midpoint. */
export function arcControlPoint(p0: Point, p2: Point, bend: number): Point {
  return { x: (p0.x + p2.x) / 2, y: (p0.y + p2.y) / 2 + bend }
}

export function arcPath(p0: Point, p2: Point, bend: number): string {
  const c = arcControlPoint(p0, p2, bend)
  return `M ${p0.x} ${p0.y} Q ${c.x} ${c.y} ${p2.x} ${p2.y}`
}

interface QuadraticSegment {
  p0: Point
  c: Point
  p2: Point
}

function splitQuadratic(seg: QuadraticSegment, t: number) {
  const q0 = lerpPoint(seg.p0, seg.c, t)
  const q1 = lerpPoint(seg.c, seg.p2, t)
  const r = lerpPoint(q0, q1, t)
  return {
    left: { p0: seg.p0, c: q0, p2: r } satisfies QuadraticSegment,
    right: { p0: r, c: q1, p2: seg.p2 } satisfies QuadraticSegment,
  }
}

function segmentToPath(seg: QuadraticSegment): string {
  return `M ${seg.p0.x} ${seg.p0.y} Q ${seg.c.x} ${seg.c.y} ${seg.p2.x} ${seg.p2.y}`
}

/** Horizontal overlap between two chords, in the shared x-axis they're arced over. */
export function overlapXRange(
  p0a: Point,
  p2a: Point,
  p0b: Point,
  p2b: Point,
): { start: number; end: number } | null {
  const aMin = Math.min(p0a.x, p2a.x)
  const aMax = Math.max(p0a.x, p2a.x)
  const bMin = Math.min(p0b.x, p2b.x)
  const bMax = Math.max(p0b.x, p2b.x)
  const start = Math.max(aMin, bMin)
  const end = Math.min(aMax, bMax)
  return start <= end ? { start, end } : null
}

/**
 * Splits an arc into two path fragments with a gap centered at `gapCenterX`,
 * producing the circuit-board "hop" where another edge passes over this one.
 * Because the control point sits at the chord's x-midpoint, x(t) is linear in
 * t, so the split parameter has a closed form (no numeric search needed).
 *
 * `gapHalfWidth` is in the same spatial x-units as `p0`/`p2` (not t-space) —
 * it's converted to a t-delta internally via the chord's x-span.
 */
export function arcPathWithGap(
  p0: Point,
  p2: Point,
  bend: number,
  gapCenterX: number,
  gapHalfWidth: number,
): { before: string; after: string } {
  const c = arcControlPoint(p0, p2, bend)
  const dx = p2.x - p0.x
  const tCenter = dx === 0 ? 0.5 : (gapCenterX - p0.x) / dx
  const halfWidthT = dx === 0 ? 0 : gapHalfWidth / Math.abs(dx)
  const t1 = Math.min(Math.max(tCenter - halfWidthT, 0.02), 0.98)
  const t2 = Math.min(Math.max(tCenter + halfWidthT, 0.02), 0.98)

  const before = splitQuadratic({ p0, c, p2 }, t1).left
  const after = splitQuadratic({ p0, c, p2 }, t2).right

  return { before: segmentToPath(before), after: segmentToPath(after) }
}
