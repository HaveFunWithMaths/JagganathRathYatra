import { edgeId, type Level, type LevelEdge } from './types'

// Node positions extracted from Graphviz neato layout (0.0 - 1.0 normalized)
const nodes = [
  { id: 'A1', normX: 0.5, normY: 0.0 },
  { id: 'B1', normX: 0.674, normY: 0.03 },
  { id: 'C1', normX: 0.826, normY: 0.117 },
  { id: 'D1', normX: 0.94, normY: 0.25 },
  { id: 'A2', normX: 1.0, normY: 0.413 },
  { id: 'B2', normX: 1.0, normY: 0.587 },
  { id: 'C2', normX: 0.94, normY: 0.75 },
  { id: 'D2', normX: 0.826, normY: 0.883 },
  { id: 'A3', normX: 0.674, normY: 0.97 },
  { id: 'B3', normX: 0.5, normY: 1.0 },
  { id: 'C3', normX: 0.326, normY: 0.97 },
  { id: 'D3', normX: 0.174, normY: 0.883 },
  { id: 'A4', normX: 0.06, normY: 0.75 },
  { id: 'B4', normX: 0.0, normY: 0.587 },
  { id: 'D4', normX: 0.0, normY: 0.413 },
  { id: 'B5', normX: 0.06, normY: 0.25 },
  { id: 'D5', normX: 0.174, normY: 0.117 },
  { id: 'D6', normX: 0.326, normY: 0.03 },
]

const rawEdges: [string, string][] = [
  ['A1', 'A2'], ['A2', 'A3'], ['A3', 'A4'], ['A4', 'A1'],
  ['A1', 'B1'],
  ['B1', 'B2'], ['B2', 'B3'], ['B3', 'B4'], ['B4', 'B5'], ['B5', 'B1'],
  ['B1', 'C1'],
  ['C1', 'C2'], ['C2', 'C3'], ['C3', 'C1'],
  ['C1', 'D1'],
  ['D1', 'D2'], ['D2', 'D3'], ['D3', 'D4'], ['D4', 'D5'], ['D5', 'D6'], ['D6', 'D1'],
]

const edges: LevelEdge[] = rawEdges.map(([a, b]) => ({
  id: edgeId(a, b),
  a,
  b,
}))

export const hardLevel: Level = {
  id: 'hard',
  label: 'Hard',
  nodes,
  edges,
  validStarts: ['A1', 'D1'],
}
