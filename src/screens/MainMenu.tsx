import { useGameStore } from '../state/gameStore'

export function MainMenu() {
  const goToModeSelect = useGameStore((s) => s.goToModeSelect)

  return (
    <div className="relative flex h-full min-h-dvh w-full items-center justify-center overflow-hidden bg-void">
      <div className="absolute inset-0">
        <img
          src="/assets/jagannath-menu.jpg"
          alt=""
          className="h-full w-full object-cover opacity-45"
          style={{ filter: 'saturate(0.8) brightness(0.55)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void" />
        <div className="fx-scanlines absolute inset-0" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="font-display text-4xl font-black tracking-wide text-cyan drop-shadow-[0_0_18px_rgba(45,226,255,0.6)] sm:text-6xl">
          JAGANNATH
          <span className="block text-gold drop-shadow-[0_0_18px_rgba(255,176,46,0.6)]">RATH YATRA</span>
        </h1>
        <p className="max-w-md font-body text-lg text-cyan-100/80 sm:text-xl">
          Trace every circuit. Cross every line only once.
        </p>

        <button
          onClick={goToModeSelect}
          className="group relative rounded-full border-2 border-gold bg-gold/10 px-12 py-4 font-display text-xl font-bold tracking-widest text-gold transition-transform active:scale-95"
          style={{ filter: 'drop-shadow(0 0 16px rgba(255,176,46,0.5))' }}
        >
          PLAY
        </button>
      </div>
    </div>
  )
}
