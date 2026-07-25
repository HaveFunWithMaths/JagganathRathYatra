import { ParticleBurst } from '../components/fx/ParticleBurst'
import { useGameStore } from '../state/gameStore'

export function VictoryScreen() {
  const retry = useGameStore((s) => s.retry)
  const goToMenu = useGameStore((s) => s.goToMenu)

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-void/85 via-void/95 to-void p-4 backdrop-blur-md">
      <ParticleBurst />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border-2 border-gold/60 bg-void-2/95 px-6 py-6 text-center shadow-[0_0_45px_rgba(255,176,46,0.45)]">
        {/* Victory Image - fully visible, uncropped */}
        <div className="relative flex w-full justify-center overflow-hidden rounded-xl border border-gold/50 bg-black/40 p-2 shadow-[0_0_24px_rgba(255,176,46,0.4)]">
          <img
            src="/assets/VictoryScreen.jpeg"
            alt="Victory Darshan"
            className="max-h-56 w-auto rounded-lg object-contain sm:max-h-64"
          />
        </div>

        <div>
          <h2
            className="font-display text-3xl font-black tracking-widest text-gold sm:text-4xl"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,176,46,0.8))' }}
          >
            JAY JAGANNATH! 🙏
          </h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-cyan-100/90 sm:text-base">
            You assisted Lord Jagannath to give His divine Darshan to everyone! Every road was beautifully covered.
          </p>
        </div>

        <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
          <button
            onClick={retry}
            className="rounded-full border-2 border-gold bg-gold/20 px-6 py-3 font-display text-sm font-bold tracking-widest text-gold transition-all hover:bg-gold/30 active:scale-95 shadow-[0_0_15px_rgba(255,176,46,0.4)]"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={goToMenu}
            className="flex items-center gap-2 rounded-full border border-cyan/50 px-6 py-3 font-display text-sm font-bold tracking-widest text-cyan transition-all hover:bg-cyan/10 active:scale-95"
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
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  )
}
