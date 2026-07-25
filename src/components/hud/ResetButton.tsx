import { useGameStore } from '../../state/gameStore'

export function ResetButton() {
  const resetLevel = useGameStore((s) => s.resetLevel)
  const phase = useGameStore((s) => s.phase)
  const history = useGameStore((s) => s.history)

  const isDisabled = phase === 'animating' || (phase === 'awaitStart' && history.length === 0)

  return (
    <button
      onClick={resetLevel}
      disabled={isDisabled}
      className={`group relative flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 font-display text-sm font-bold tracking-wider transition-all active:scale-95 ${
        isDisabled
          ? 'cursor-not-allowed border-magenta-900/30 bg-void/50 text-cyan-100/20'
          : 'border-magenta/60 bg-magenta/15 text-magenta shadow-[0_0_12px_rgba(255,61,240,0.3)] hover:bg-magenta/25'
      }`}
      title="Reset current level"
    >
      <span className="text-base">🔄</span>
      <span>RESET</span>
    </button>
  )
}
