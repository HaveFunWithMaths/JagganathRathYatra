import { edgeId, type Level, type LevelEdge } from './types'

const ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P', 'Q', 'R'],
]

const nodes = ROWS.flatMap((row, rowIdx) =>
  row.map((id, colIdx) => ({
    id,
    normX: colIdx / 5,
    normY: rowIdx / 2,
  })),
)

const rowEdges: [string, string][] = ROWS.flatMap((row) =>
  row.slice(0, -1).map((id, i): [string, string] => [id, row[i + 1]]),
)

const verticalEdges: [string, string][] = [
  ['A', 'G'],
  ['G', 'M'],
  ['B', 'H'],
  ['H', 'N'],
  ['C', 'I'],
  ['I', 'O'],
  ['D', 'J'],
  ['J', 'P'],
  ['E', 'K'],
  ['K', 'Q'],
  ['F', 'L'],
  ['L', 'R'],
]

const plainEdges: LevelEdge[] = [...rowEdges, ...verticalEdges].map(([a, b]) => ({
  id: edgeId(a, b),
  a,
  b,
}))

// Row 1 arcs bulge upward (away from the grid, normY < 0); Row 3 arcs bulge
// downward (normY > 1). B-D/N-P are drawn on top; C-E/O-Q get the stroke gap
// where the other edge passes over (Section 5.2/7.6).
const crossingEdges: LevelEdge[] = [
  { id: edgeId('B', 'D'), a: 'B', b: 'D', crossing: { role: 'over', bend: -0.16 } },
  { id: edgeId('C', 'E'), a: 'C', b: 'E', crossing: { role: 'under', bend: -0.16 } },
  { id: edgeId('N', 'P'), a: 'N', b: 'P', crossing: { role: 'over', bend: 0.16 } },
  { id: edgeId('O', 'Q'), a: 'O', b: 'Q', crossing: { role: 'under', bend: 0.16 } },
]

export const hardLevel: Level = {
  id: 'hard',
  label: 'Hard',
  nodes,
  edges: [...plainEdges, ...crossingEdges],
  validStarts: ['G', 'L'],
}
