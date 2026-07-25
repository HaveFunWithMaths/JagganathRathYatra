import { ParticleBurst } from '../components/fx/ParticleBurst'
import { useGameStore } from '../state/gameStore'

export function VictoryScreen() {
  const retry = useGameStore((s) => s.retry)
  const goToModeSelect = useGameStore((s) => s.goToModeSelect)
  const goToMenu = useGameStore((s) => s.goToMenu)

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-transparent via-void/70 to-void">
      <ParticleBurst />
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <h2
          className="font-display text-4xl font-black tracking-widest text-gold sm:text-5xl"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,176,46,0.7))' }}
        >
          TRAIL COMPLETE
        </h2>
        <p className="font-body text-lg text-cyan-100/80">Every circuit traced. Every line crossed once.</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={retry}
            className="rounded-full border-2 border-gold bg-gold/10 px-8 py-3 font-display text-base font-bold tracking-widest text-gold active:scale-95"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={goToModeSelect}
            className="rounded-full border border-cyan/40 px-8 py-3 font-display text-base font-bold tracking-widest text-cyan active:scale-95"
          >
            MODE SELECT
          </button>
          <button onClick={goToMenu} className="font-body text-sm text-cyan-100/50 underline underline-offset-4">
            Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}
