import { create } from 'zustand'
import { levels, type ModeId, type NodeId } from '../levels'
import { audioManager } from '../logic/audioManager'
import { isDeadEnd, isVictory, legalMoves } from '../logic/graphAnalysis'
import type { GameState, Move } from './types'

interface GameActions {
  goToMenu: () => void
  goToModeSelect: () => void
  selectMode: (mode: ModeId) => void
  selectStartNode: (node: NodeId) => void
  beginMove: (to: NodeId) => boolean
  completeMove: () => void
  undo: () => void
  retry: () => void
  resetLevel: () => void
  toggleMusic: () => void
  toggleSound: () => void
}

const initialState: GameState = {
  phase: 'menu',
  mode: null,
  startNode: null,
  currentNode: null,
  traversed: new Set(),
  history: [],
  pendingMove: null,
  musicEnabled: true,
  soundEnabled: true,
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  goToMenu: () => set({ ...initialState, musicEnabled: get().musicEnabled, soundEnabled: get().soundEnabled, traversed: new Set(), history: [] }),

  goToModeSelect: () => set({ phase: 'modeSelect', mode: null }),

  selectMode: (mode) => {
    audioManager.playClick()
    audioManager.playMusic()
    set({
      phase: 'awaitStart',
      mode,
      startNode: null,
      currentNode: null,
      traversed: new Set(),
      history: [],
      pendingMove: null,
    })
  },

  selectStartNode: (node) => {
    audioManager.playClick()
    set({
      phase: 'playing',
      startNode: node,
      currentNode: node,
    })
  },

  beginMove: (to) => {
    const state = get()
    if (state.phase !== 'playing' || !state.mode || !state.currentNode) return false
    const level = levels[state.mode]
    const moves = legalMoves(level, state.currentNode, state.traversed)
    const match = moves.find((m) => m.other === to)
    if (!match) return false
    audioManager.playMove()
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

    if (victory) audioManager.playVictory()
    else if (deadEnd) audioManager.playDeadEnd()

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
    audioManager.playClick()
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
    audioManager.playClick()
    set({
      phase: 'awaitStart',
      startNode: null,
      currentNode: null,
      traversed: new Set(),
      history: [],
      pendingMove: null,
    })
  },

  resetLevel: () => {
    const state = get()
    if (!state.mode) return
    audioManager.playClick()
    set({
      phase: 'awaitStart',
      startNode: null,
      currentNode: null,
      traversed: new Set(),
      history: [],
      pendingMove: null,
    })
  },

  toggleMusic: () => {
    const next = !get().musicEnabled
    audioManager.setMusicEnabled(next)
    set({ musicEnabled: next })
  },

  toggleSound: () => {
    const next = !get().soundEnabled
    audioManager.setSoundEnabled(next)
    set({ soundEnabled: next })
  },
}))

