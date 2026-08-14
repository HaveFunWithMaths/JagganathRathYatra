import { edgeId, type Level, type LevelEdge } from './types'

// Node positions extracted from Graphviz neato layout (0.0 - 1.0 normalized)
const nodes = [
  { id: 'A', normX: 0.657, normY: 1.0 },
  { id: 'B', normX: 0.486, normY: 0.84 },
  { id: 'C', normX: 0.402, normY: 0.658 },
  { id: 'D', normX: 0.104, normY: 0.872 },
  { id: 'E', normX: 0.167, normY: 0.513 },
  { id: 'F', normX: 0.0, normY: 0.346 },
  { id: 'G', normX: 0.865, normY: 0.862 },
  { id: 'H', normX: 0.707, normY: 0.706 },
  { id: 'I', normX: 0.581, normY: 0.537 },
  { id: 'J', normX: 0.418, normY: 0.464 },
  { id: 'K', normX: 0.294, normY: 0.294 },
  { id: 'L', normX: 0.136, normY: 0.138 },
  { id: 'M', normX: 1.0, normY: 0.653 },
  { id: 'N', normX: 0.834, normY: 0.487 },
  { id: 'O', normX: 0.898, normY: 0.127 },
  { id: 'P', normX: 0.599, normY: 0.345 },
  { id: 'Q', normX: 0.514, normY: 0.161 },
  { id: 'R', normX: 0.344, normY: 0.0 },
]

const removals = new Set(['D-E', 'C-E', 'C-D', 'I-O', 'I-J', 'J-P', 'O-P'])

const rawEdges: [string, string][] = [
  // Row edges
  ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'],
  ['G', 'H'], ['H', 'I'], ['I', 'J'], ['J', 'K'], ['K', 'L'],
  ['M', 'N'], ['N', 'O'], ['O', 'P'], ['P', 'Q'], ['Q', 'R'],
  // Vertical connectors
  ['A', 'G'], ['G', 'M'],
  ['B', 'H'], ['H', 'N'],
  ['C', 'I'], ['I', 'O'],
  ['D', 'J'], ['J', 'P'],
  ['E', 'K'], ['K', 'Q'],
  ['F', 'L'], ['L', 'R'],
  // Skip edges
  ['B', 'D'], ['C', 'E'], ['N', 'P'], ['O', 'Q'],
].filter(([a, b]) => !removals.has(edgeId(a, b))) as [string, string][]

const edges: LevelEdge[] = rawEdges.map(([a, b]) => ({
  id: edgeId(a, b),
  a,
  b,
}))

export const mediumLevel: Level = {
  id: 'medium',
  label: 'Medium',
  nodes,
  edges,
  validStarts: ['G', 'L'],
}
