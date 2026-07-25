import { useGameStore } from '../../state/gameStore'
import { ModeBadge } from './ModeBadge'
import { ProgressReadout } from './ProgressReadout'
import { UndoButton } from './UndoButton'

/**
 * Desktop (≥768px): static side panel, doesn't overlay the graph.
 * Mobile: compact bar pinned to the bottom, within thumb reach (Section 8).
 */
export function HUD() {
  const goToModeSelect = useGameStore((s) => s.goToModeSelect)

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 flex flex-row items-center justify-between gap-4 border-t border-cyan-900/40 bg-void/90 px-4 py-3 backdrop-blur
        md:static md:h-full md:w-72 md:flex-col md:items-stretch md:justify-start md:gap-8 md:border-t-0 md:border-l md:px-6 md:py-10"
    >
      <div className="hidden md:block">
        <ModeBadge />
      </div>

      <div className="min-w-0 flex-1 md:flex-none">
        <ProgressReadout />
      </div>

      <div className="flex items-center gap-3">
        <UndoButton />
      </div>

      <button
        onClick={goToModeSelect}
        className="hidden font-body text-sm text-cyan-100/40 underline underline-offset-4 md:mt-auto md:block"
      >
        Change Mode
      </button>
    </div>
  )
}
