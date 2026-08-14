import { useEffect, useState } from 'react'
import { HUD } from '../components/hud/HUD'
import { GraphCanvas } from '../components/graph/GraphCanvas'
import { useIsMobile } from '../hooks/useIsMobile'
import { useGameStore } from '../state/gameStore'
import { useCurrentLevel } from '../state/selectors'
import { DeadEndScreen } from './DeadEndScreen'
import { VictoryScreen } from './VictoryScreen'

export function GameScreen() {
  const phase = useGameStore((s) => s.phase)
  const mode = useGameStore((s) => s.mode)
  const level = useCurrentLevel()
  const isMobile = useIsMobile()
  const [revealEnd, setRevealEnd] = useState(false)

  useEffect(() => {
    if (phase !== 'victory' && phase !== 'deadEnd') setRevealEnd(false)
  }, [phase])

  if (!mode || !level) return null

  const panZoomEnabled = isMobile && (mode === 'medium' || mode === 'hard')

  return (
    <div className="relative flex h-dvh w-full flex-col bg-void md:flex-row">
      <div className="relative min-h-0 flex-1 pt-28 pb-20 md:py-0">
        <GraphCanvas panZoomEnabled={panZoomEnabled} onSequenceComplete={() => setRevealEnd(true)} />

        {phase === 'awaitStart' && (
          <div className="pointer-events-none absolute inset-x-0 top-34 z-10 flex justify-center px-4 md:top-6">
            <div className="rounded-full border border-magenta/40 bg-void/80 px-5 py-2 font-display text-sm tracking-widest text-magenta backdrop-blur shadow-[0_0_15px_rgba(255,45,149,0.3)]">
              PICK A STARTING NODE
            </div>
          </div>
        )}

        {phase === 'victory' && revealEnd && <VictoryScreen />}
        {phase === 'deadEnd' && revealEnd && <DeadEndScreen />}
      </div>

      <HUD />
    </div>
  )
}
