import { useGameStore } from '../state/gameStore'

export function DeadEndScreen() {
  const undo = useGameStore((s) => s.undo)
  const retry = useGameStore((s) => s.retry)
  const goToModeSelect = useGameStore((s) => s.goToModeSelect)
  const goToMenu = useGameStore((s) => s.goToMenu)

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-transparent via-void/80 to-void">
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <h2
          className="fx-glitch font-display text-4xl font-black tracking-widest text-danger sm:text-5xl"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,59,78,0.7))' }}
        >
          DEAD END
        </h2>
        <p className="font-body text-lg text-cyan-100/80">No unused paths left from here.</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={undo}
            className="rounded-full border-2 border-cyan bg-cyan/10 px-8 py-3 font-display text-base font-bold tracking-widest text-cyan active:scale-95"
          >
            UNDO LAST MOVE
          </button>
          <button
            onClick={retry}
            className="rounded-full border border-danger/50 px-8 py-3 font-display text-base font-bold tracking-widest text-danger active:scale-95"
          >
            RETRY
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={goToModeSelect}
            className="font-body text-sm text-cyan-100/50 underline underline-offset-4"
          >
            Mode Select
          </button>
          <button onClick={goToMenu} className="font-body text-sm text-cyan-100/50 underline underline-offset-4">
            Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}
