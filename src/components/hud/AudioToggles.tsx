import { useGameStore } from '../../state/gameStore'

export function AudioToggles() {
  const musicEnabled = useGameStore((s) => s.musicEnabled)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleMusic = useGameStore((s) => s.toggleMusic)
  const toggleSound = useGameStore((s) => s.toggleSound)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMusic}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-all active:scale-95 ${
          musicEnabled
            ? 'border-gold/60 bg-gold/15 text-gold shadow-[0_0_10px_rgba(255,176,46,0.3)]'
            : 'border-cyan-900/40 bg-void/50 text-cyan-100/30'
        }`}
        title={`Music: ${musicEnabled ? 'ON' : 'OFF'}`}
      >
        🎵
      </button>

      <button
        onClick={toggleSound}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-all active:scale-95 ${
          soundEnabled
            ? 'border-cyan/60 bg-cyan/15 text-cyan shadow-[0_0_10px_rgba(45,226,255,0.3)]'
            : 'border-cyan-900/40 bg-void/50 text-cyan-100/30'
        }`}
        title={`SFX: ${soundEnabled ? 'ON' : 'OFF'}`}
      >
        🔊
      </button>
    </div>
  )
}
