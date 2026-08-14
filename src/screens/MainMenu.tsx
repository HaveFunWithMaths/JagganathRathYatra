import { easyLevel } from '../levels/easy'
import { mediumLevel } from '../levels/medium'
import { hardLevel } from '../levels/hard'
import { useGameStore } from '../state/gameStore'

export function MainMenu() {
  const selectMode = useGameStore((s) => s.selectMode)
  const musicEnabled = useGameStore((s) => s.musicEnabled)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleMusic = useGameStore((s) => s.toggleMusic)
  const toggleSound = useGameStore((s) => s.toggleSound)

  return (
    <div className="relative flex h-full min-h-dvh w-full flex-col items-center justify-center overflow-y-auto bg-void px-6 py-8 text-center">
      {/* Background Cyberpunk Accents */}
      <div className="fx-scanlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      {/* Top Controls Bar: Audio Toggles */}
      <div className="relative z-20 mb-4 flex items-center justify-center gap-3">
        <button
          onClick={toggleMusic}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 font-display text-xs font-bold tracking-widest transition-all active:scale-95 ${
            musicEnabled
              ? 'border-gold bg-gold/15 text-gold shadow-[0_0_12px_rgba(255,176,46,0.3)]'
              : 'border-cyan-900/60 bg-void/80 text-cyan-100/40'
          }`}
        >
          <span>🎵 MUSIC: {musicEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 font-display text-xs font-bold tracking-widest transition-all active:scale-95 ${
            soundEnabled
              ? 'border-cyan bg-cyan/15 text-cyan shadow-[0_0_12px_rgba(45,226,255,0.3)]'
              : 'border-cyan-900/60 bg-void/80 text-cyan-100/40'
          }`}
        >
          <span>🔊 SFX: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
        {/* Title */}
        <div>
          <h1 className="font-display text-3xl font-black tracking-wider text-cyan drop-shadow-[0_0_20px_rgba(45,226,255,0.6)] sm:text-5xl">
            JAGANNATH
            <span className="block text-gold drop-shadow-[0_0_20px_rgba(255,176,46,0.6)]">
              RATH YATRA
            </span>
          </h1>
          <p className="mt-2 font-body text-sm leading-relaxed text-cyan-100/80 sm:text-base">
            Organise the Rath Yatra so Lord Jagannath travels through all roads exactly once!
          </p>
        </div>

        {/* Main Menu Image (Below Title) */}
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border-2 border-gold/60 bg-void-2 shadow-[0_0_28px_rgba(255,176,46,0.4)] sm:max-w-md">
          <img
            src="/assets/jagannath-menu.jpg"
            alt="Jagannath Rath Yatra"
            className="h-44 w-full object-cover sm:h-52"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80" />
        </div>

        {/* Mode Selection Buttons directly on Main Menu */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            onClick={() => selectMode('easy')}
            className="group relative flex-1 rounded-xl border-2 border-cyan bg-cyan/10 px-4 py-3 text-center transition-all hover:bg-cyan/20 active:scale-95 shadow-[0_0_20px_rgba(45,226,255,0.3)]"
          >
            <div className="font-display text-lg font-black tracking-widest text-cyan">
              EASY MODE
            </div>
            <div className="mt-1 font-body text-xs text-cyan-100/70">
              {easyLevel.nodes.length} Nodes · {easyLevel.edges.length} Edges
            </div>
          </button>

          <button
            onClick={() => selectMode('medium')}
            className="group relative flex-1 rounded-xl border-2 border-gold bg-gold/10 px-4 py-3 text-center transition-all hover:bg-gold/20 active:scale-95 shadow-[0_0_20px_rgba(255,176,46,0.3)]"
          >
            <div className="font-display text-lg font-black tracking-widest text-gold">
              MEDIUM MODE
            </div>
            <div className="mt-1 font-body text-xs text-cyan-100/70">
              {mediumLevel.nodes.length} Nodes · {mediumLevel.edges.length} Edges
            </div>
          </button>

          <button
            onClick={() => selectMode('hard')}
            className="group relative flex-1 rounded-xl border-2 border-magenta bg-magenta/10 px-4 py-3 text-center transition-all hover:bg-magenta/20 active:scale-95 shadow-[0_0_20px_rgba(255,61,240,0.3)]"
          >
            <div className="font-display text-lg font-black tracking-widest text-magenta">
              HARD MODE
            </div>
            <div className="mt-1 font-body text-xs text-cyan-100/70">
              {hardLevel.nodes.length} Nodes · {hardLevel.edges.length} Edges
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
