import { hardLevel } from '../levels/hard'
import { easyLevel } from '../levels/easy'
import { useGameStore } from '../state/gameStore'

const MODES = [
  {
    id: 'easy' as const,
    level: easyLevel,
    accent: 'text-cyan border-cyan shadow-[0_0_24px_rgba(45,226,255,0.35)]',
    description: `${easyLevel.nodes.length} nodes · ${easyLevel.edges.length} edges`,
  },
  {
    id: 'hard' as const,
    level: hardLevel,
    accent: 'text-magenta border-magenta shadow-[0_0_24px_rgba(255,61,240,0.35)]',
    description: `${hardLevel.nodes.length} nodes · ${hardLevel.edges.length} edges`,
  },
]

export function ModeSelect() {
  const selectMode = useGameStore((s) => s.selectMode)
  const goToMenu = useGameStore((s) => s.goToMenu)

  return (
    <div className="flex h-full min-h-dvh w-full flex-col items-center justify-center gap-10 bg-void px-6 py-12">
      <h2 className="font-display text-2xl font-bold tracking-widest text-cyan-100 sm:text-3xl">
        SELECT MODE
      </h2>

      <div className="flex w-full max-w-3xl flex-col gap-6 sm:flex-row">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => selectMode(mode.id)}
            className={`flex-1 rounded-2xl border-2 bg-void-2/60 px-8 py-10 text-center transition-transform active:scale-95 ${mode.accent}`}
          >
            <div className="font-display text-3xl font-black uppercase tracking-widest">{mode.level.label}</div>
            <div className="mt-3 font-body text-base text-cyan-100/70">{mode.description}</div>
          </button>
        ))}
      </div>

      <button
        onClick={goToMenu}
        className="flex items-center gap-2 font-body text-sm tracking-wide text-cyan-100/60 underline underline-offset-4 transition-colors hover:text-cyan"
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
        <span>Back to Main Menu</span>
      </button>
    </div>
  )
}
