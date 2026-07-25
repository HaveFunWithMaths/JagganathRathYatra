import { describe, expect, it } from 'vitest'
import { easyLevel } from '../levels/easy'
import { hardLevel } from '../levels/hard'
import {
  arcPathWithGap,
  computeDegrees,
  findEulerianTrail,
  hasEulerianTrail,
  isDeadEnd,
  isVictory,
  legalMoves,
  oddDegreeNodes,
  overlapXRange,
} from './graphAnalysis'

describe('easy level data', () => {
  it('has the authored degree table', () => {
    expect(computeDegrees(easyLevel)).toEqual({
      A: 2,
      B: 2,
      C: 4,
      D: 2,
      E: 3,
      F: 3,
      G: 2,
      H: 2,
      I: 2,
    })
  })

  it('has exactly E and F as odd-degree (valid start/end) nodes', () => {
    expect(oddDegreeNodes(easyLevel).sort()).toEqual(['E', 'F'])
    expect(easyLevel.validStarts.slice().sort()).toEqual(['E', 'F'])
  })

  it('admits an Eulerian trail', () => {
    expect(hasEulerianTrail(easyLevel)).toBe(true)
  })

  it('is solvable via Hierholzer from each valid start', () => {
    for (const start of easyLevel.validStarts) {
      const trail = findEulerianTrail(easyLevel, start)
      expect(trail).not.toBeNull()
      expect(trail).toHaveLength(easyLevel.edges.length)
    }
  })
})

describe('hard level data', () => {
  it('marks only G and L as odd-degree (valid start/end) nodes', () => {
    expect(oddDegreeNodes(hardLevel).sort()).toEqual(['G', 'L'])
    expect(hardLevel.validStarts.slice().sort()).toEqual(['G', 'L'])
  })

  it('has 18 nodes and 24 edges', () => {
    expect(hardLevel.nodes).toHaveLength(18)
    expect(hardLevel.edges).toHaveLength(24)
  })

  it('admits an Eulerian trail', () => {
    expect(hasEulerianTrail(hardLevel)).toBe(true)
  })

  it('is solvable via Hierholzer from each valid start', () => {
    for (const start of hardLevel.validStarts) {
      const trail = findEulerianTrail(hardLevel, start)
      expect(trail).not.toBeNull()
      expect(trail).toHaveLength(hardLevel.edges.length)
    }
  })
})

describe('legal moves / victory / dead-end', () => {
  it('reports all incident edges as legal before any traversal', () => {
    const moves = legalMoves(easyLevel, 'C', new Set())
    expect(moves).toHaveLength(4) // C has degree 4
  })

  it('excludes traversed edges from legal moves', () => {
    const traversed = new Set(['A-C'])
    const moves = legalMoves(easyLevel, 'C', traversed)
    expect(moves.map((m) => m.edge.id)).not.toContain('A-C')
    expect(moves).toHaveLength(3)
  })

  it('detects victory once every edge is traversed', () => {
    const all = new Set(easyLevel.edges.map((e) => e.id))
    expect(isVictory(easyLevel, all)).toBe(true)
  })

  it('detects a dead end when stuck with edges remaining', () => {
    // D only connects to B and C; exhaust both without finishing the graph.
    const traversed = new Set(['B-D', 'C-D'])
    expect(isDeadEnd(easyLevel, 'D', traversed)).toBe(true)
  })

  it('does not report dead end when legal moves remain', () => {
    expect(isDeadEnd(easyLevel, 'C', new Set())).toBe(false)
  })
})

describe('crossing-edge arc geometry', () => {
  it('computes the overlap range between two crossing chords', () => {
    // Mirrors B-D (cols 2-4) vs C-E (cols 3-5) in normalized x (col-1)/5.
    const bD = { p0: { x: 0.2, y: 0 }, p2: { x: 0.6, y: 0 } }
    const cE = { p0: { x: 0.4, y: 0 }, p2: { x: 0.8, y: 0 } }
    const overlap = overlapXRange(bD.p0, bD.p2, cE.p0, cE.p2)
    expect(overlap).toEqual({ start: 0.4, end: 0.6 })
  })

  it('produces two disjoint path fragments with a gap between them', () => {
    const p0 = { x: 0.4, y: 0 }
    const p2 = { x: 0.8, y: 0 }
    const { before, after } = arcPathWithGap(p0, p2, -0.16, 0.5, 0.03)
    expect(before).toMatch(/^M 0\.4/)
    expect(after).toContain('0.8')
    expect(before).not.toEqual(after)
  })
})
