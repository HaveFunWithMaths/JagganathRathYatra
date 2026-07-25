import { useMemo } from 'react'
import { levels, type NodeId } from '../levels'
import { legalMoves } from '../logic/graphAnalysis'
import { useGameStore } from './gameStore'

export function useCurrentLevel() {
  const mode = useGameStore((s) => s.mode)
  return mode ? levels[mode] : null
}

export function useLegalMoves() {
  const mode = useGameStore((s) => s.mode)
  const currentNode = useGameStore((s) => s.currentNode)
  const traversed = useGameStore((s) => s.traversed)
  return useMemo(() => {
    if (!mode || !currentNode) return []
    return legalMoves(levels[mode], currentNode, traversed)
  }, [mode, currentNode, traversed])
}

/** Nodes the avatar has stood on this run — start node plus every move's destination. */
export function useVisitedNodes(): ReadonlySet<NodeId> {
  const startNode = useGameStore((s) => s.startNode)
  const history = useGameStore((s) => s.history)
  return useMemo(() => {
    const set = new Set<NodeId>()
    if (startNode) set.add(startNode)
    for (const move of history) set.add(move.to)
    return set
  }, [startNode, history])
}

export function useProgress() {
  const mode = useGameStore((s) => s.mode)
  const traversed = useGameStore((s) => s.traversed)
  const total = mode ? levels[mode].edges.length : 0
  return { done: traversed.size, total }
}
