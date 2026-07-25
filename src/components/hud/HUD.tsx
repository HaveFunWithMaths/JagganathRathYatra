import { AudioToggles } from './AudioToggles'
import { HomeButton } from './HomeButton'
import { ModeBadge } from './ModeBadge'
import { ProgressReadout } from './ProgressReadout'
import { ResetButton } from './ResetButton'
import { UndoButton } from './UndoButton'

export function HUD() {
  return (
    <>
      {/* Mobile Layout */}
      {/* Top Header: Progress Readout + Mode + Audio + Home */}
      <div className="fixed inset-x-0 top-0 z-20 flex flex-col gap-2.5 border-b border-cyan-900/40 bg-void/95 px-4 py-3 backdrop-blur shadow-md md:hidden">
        <div className="flex items-center justify-between">
          <ModeBadge />
          <div className="flex items-center gap-2">
            <AudioToggles />
            <HomeButton />
          </div>
        </div>
        <ProgressReadout />
      </div>

      {/* Mobile Bottom Action Bar: Undo + Reset */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-center border-t border-cyan-900/40 bg-void/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex w-full max-w-sm gap-3">
          <div className="flex-1">
            <UndoButton />
          </div>
          <div className="flex-1">
            <ResetButton />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:h-full md:w-72 md:flex-col md:items-stretch md:justify-start md:gap-6 md:border-l md:border-cyan-900/40 md:bg-void/90 md:px-6 md:py-8 md:backdrop-blur">
        <div className="flex items-center justify-between">
          <ModeBadge />
          <div className="flex items-center gap-2">
            <AudioToggles />
            <HomeButton />
          </div>
        </div>

        <ProgressReadout />

        <div className="mt-2 flex flex-col gap-3">
          <UndoButton />
          <ResetButton />
        </div>
      </div>
    </>
  )
}
