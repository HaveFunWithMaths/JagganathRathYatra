import { useGameStore } from '../../state/gameStore'

export function UndoButton() {
  const undo = useGameStore((s) => s.undo)
  const historyLength = useGameStore((s) => s.history.length)
  const phase = useGameStore((s) => s.phase)
  const disabled = historyLength === 0 || phase !== 'playing'

  return (
    <button
      onClick={undo}
      disabled={disabled}
      className="rounded-lg border border-cyan/40 bg-void-2 px-4 py-2.5 font-display text-sm font-bold tracking-widest text-cyan transition-opacity disabled:opacity-30"
    >
      UNDO
    </button>
  )
}
