import { edgeId, type Level } from './types'

const rawEdges: [string, string][] = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['C', 'D'],
  ['C', 'E'],
  ['C', 'F'],
  ['E', 'F'],
  ['F', 'G'],
  ['E', 'H'],
  ['H', 'I'],
  ['I', 'G'],
]

export const easyLevel: Level = {
  id: 'easy',
  label: 'Easy',
  nodes: [
    { id: 'A', normX: 0.37, normY: 0.0 },
    { id: 'B', normX: 0.8, normY: 0.0 },
    { id: 'C', normX: 0.37, normY: 0.27 },
    { id: 'D', normX: 0.8, normY: 0.27 },
    { id: 'E', normX: 0.0, normY: 0.71 },
    { id: 'F', normX: 0.37, normY: 0.71 },
    { id: 'G', normX: 1.0, normY: 0.71 },
    { id: 'H', normX: 0.17, normY: 1.0 },
    { id: 'I', normX: 0.8, normY: 1.0 },
  ],
  edges: rawEdges.map(([a, b]) => ({ id: edgeId(a, b), a, b })),
  validStarts: ['E', 'F'],
}
