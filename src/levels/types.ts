export type NodeId = string
export type EdgeId = string // canonical form "A-B", endpoints alphabetically sorted

export interface LevelNode {
  id: NodeId
  normX: number
  normY: number
}

export interface LevelEdge {
  id: EdgeId
  a: NodeId
  b: NodeId
  /** Crossing edges render as arcs with an explicit over/under hop (Section 5.2/7.6). */
  crossing?: {
    role: 'over' | 'under'
    bend: number // arc sagitta as a fraction of the level's normalized height
  }
}

export interface Level {
  id: 'easy' | 'hard'
  label: string
  nodes: LevelNode[]
  edges: LevelEdge[]
  validStarts: [NodeId, NodeId]
}

export function edgeId(a: NodeId, b: NodeId): EdgeId {
  return a < b ? `${a}-${b}` : `${b}-${a}`
}
