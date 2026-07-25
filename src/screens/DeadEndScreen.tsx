import { useGameStore } from '../state/gameStore'
import { useCurrentLevel } from '../state/selectors'

export function DeadEndScreen() {
  const undo = useGameStore((s) => s.undo)
  const retry = useGameStore((s) => s.retry)
  const goToMenu = useGameStore((s) => s.goToMenu)
  const traversed = useGameStore((s) => s.traversed)
  const level = useCurrentLevel()

  const covered = traversed.size
  const total = level ? level.edges.length : 0

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-void/85 via-void/95 to-void p-4 backdrop-blur-md">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border-2 border-danger/60 bg-void-2/95 px-6 py-6 text-center shadow-[0_0_40px_rgba(255,59,78,0.35)]">
        <h2
          className="fx-glitch font-display text-3xl font-black tracking-widest text-danger sm:text-4xl"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,59,78,0.7))' }}
        >
          RATH YATRA STUCK!
        </h2>

        <p className="font-body text-sm leading-relaxed text-cyan-100/90 sm:text-base">
          Lord Jagannath wants to travel on all remaining unused roads as well! Give it another try so no road is left behind.
        </p>

        {/* Display roads covered count */}
        <div className="rounded-xl border border-gold/40 bg-gold/10 px-6 py-3 font-display text-base font-bold tracking-wide text-gold shadow-[0_0_15px_rgba(255,176,46,0.2)]">
          Roads Covered: <span className="text-xl text-cyan">{covered}</span> / <span className="text-xl">{total}</span>
        </div>

        <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
          <button
            onClick={undo}
            className="rounded-full border-2 border-cyan bg-cyan/15 px-6 py-3 font-display text-xs font-bold tracking-widest text-cyan transition-all hover:bg-cyan/25 active:scale-95 shadow-[0_0_12px_rgba(45,226,255,0.3)]"
          >
            UNDO LAST MOVE
          </button>
          <button
            onClick={retry}
            className="rounded-full border border-danger/60 bg-danger/15 px-6 py-3 font-display text-xs font-bold tracking-widest text-danger transition-all hover:bg-danger/25 active:scale-95"
          >
            RETRY LEVEL
          </button>
        </div>

        <button
          onClick={goToMenu}
          className="flex items-center gap-2 font-body text-xs text-cyan-100/60 underline underline-offset-4 transition-colors hover:text-cyan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Main Menu</span>
        </button>
      </div>
    </div>
  )
}
