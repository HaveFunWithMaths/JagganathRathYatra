import { create } from 'zustand'
import { levels, type ModeId, type NodeId } from '../levels'
import { isDeadEnd, isVictory, legalMoves } from '../logic/graphAnalysis'
import type { GameState, Move } from './types'

interface GameActions {
  goToMenu: () => void
  goToModeSelect: () => void
  selectMode: (mode: ModeId) => void
  selectStartNode: (node: NodeId) => void
  /** Validates the tap and locks input for the GSAP traversal animation. Returns false if illegal. */
  beginMove: (to: NodeId) => boolean
  /** Called by the animation hook once the avatar's MotionPath tween completes. */
  completeMove: () => void
  /** Pops the last move; used by both the in-game Undo button and the Dead-End screen's "Undo Last Move". */
  undo: () => void
  retry: () => void
}

const initialState: GameState = {
  phase: 'menu',
  mode: null,
  startNode: null,
  currentNode: null,
  traversed: new Set(),
  history: [],
  pendingMove: null,
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  goToMenu: () => set({ ...initialState, traversed: new Set(), history: [] }),

  goToModeSelect: () => set({ phase: 'modeSelect', mode: null }),

  selectMode: (mode) =>
    set({
      phase: 'awaitStart',
      mode,
      startNode: null,
      currentNode: null,
      traversed: new Set(),
      history: [],
      pendingMove: null,
    }),

  selectStartNode: (node) =>
    set({
      phase: 'playing',
      startNode: node,
      currentNode: node,
    }),

  beginMove: (to) => {
    const state = get()
    if (state.phase !== 'playing' || !state.mode || !state.currentNode) return false
    const level = levels[state.mode]
    const moves = legalMoves(level, state.currentNode, state.traversed)
    const match = moves.find((m) => m.other === to)
    if (!match) return false
    set({
      phase: 'animating',
      pendingMove: { edgeId: match.edge.id, from: state.currentNode, to },
    })
    return true
  },

  completeMove: () => {
    const state = get()
    const pending = state.pendingMove
    if (!pending || !state.mode) return
    const level = levels[state.mode]
    const traversed = new Set(state.traversed)
    traversed.add(pending.edgeId)
    const history: Move[] = [...state.history, pending]

    const victory = isVictory(level, traversed)
    const deadEnd = !victory && isDeadEnd(level, pending.to, traversed)

    set({
      traversed,
      history,
      currentNode: pending.to,
      pendingMove: null,
      phase: victory ? 'victory' : deadEnd ? 'deadEnd' : 'playing',
    })
  },

  undo: () => {
    const state = get()
    if (state.history.length === 0) return
    const last = state.history[state.history.length - 1]
    const traversed = new Set(state.traversed)
    traversed.delete(last.edgeId)
    set({
      traversed,
      history: state.history.slice(0, -1),
      currentNode: last.from,
      pendingMove: null,
      phase: 'playing',
    })
  },

  retry: () => {
    const state = get()
    if (!state.mode) return
    set({
      phase: 'awaitStart',
      startNode: null,
      currentNode: null,
      traversed: new Set(),
      history: [],
      pendingMove: null,
    })
  },
}))
