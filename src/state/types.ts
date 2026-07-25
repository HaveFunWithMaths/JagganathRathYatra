import type { EdgeId, ModeId, NodeId } from '../levels'

export type Phase =
  | 'menu'
  | 'modeSelect'
  | 'awaitStart'
  | 'playing'
  | 'animating'
  | 'victory'
  | 'deadEnd'

export interface Move {
  edgeId: EdgeId
  from: NodeId
  to: NodeId
}

export interface PendingMove {
  edgeId: EdgeId
  from: NodeId
  to: NodeId
}

export interface GameState {
  phase: Phase
  mode: ModeId | null
  startNode: NodeId | null
  currentNode: NodeId | null
  traversed: Set<EdgeId>
  history: Move[]
  pendingMove: PendingMove | null
  musicEnabled: boolean
  soundEnabled: boolean
}
