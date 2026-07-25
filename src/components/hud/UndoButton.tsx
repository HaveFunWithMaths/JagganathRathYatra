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
      className="flex w-full items-center justify-center rounded-xl border border-cyan/60 bg-cyan/15 px-4 py-2 font-display text-sm font-bold tracking-widest text-cyan shadow-[0_0_12px_rgba(45,226,255,0.25)] transition-all hover:bg-cyan/25 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
    >
      <span className="text-base">↩️</span>
      <span>UNDO</span>
    </button>
  )
}
