// Web Audio API & BGM Audio Manager for Jagannath Rath Yatra

class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null
  private audioCtx: AudioContext | null = null
  private musicEnabled = true
  private soundEnabled = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.bgmAudio = new Audio('/assets/SriJagannathaAshtakam.mp3')
      this.bgmAudio.loop = true
      this.bgmAudio.volume = 0.45
    }
  }

  private initAudioCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled
    if (enabled) {
      this.playMusic()
    } else {
      this.pauseMusic()
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled
  }

  public playMusic() {
    if (!this.musicEnabled || !this.bgmAudio) return
    this.bgmAudio.play().catch(() => {
      // Browser autoplay restriction waiting for user interaction
      const handleUserInteraction = () => {
        if (this.musicEnabled && this.bgmAudio) {
          this.bgmAudio.play().catch(() => {})
        }
        window.removeEventListener('click', handleUserInteraction)
        window.removeEventListener('keydown', handleUserInteraction)
        window.removeEventListener('touchstart', handleUserInteraction)
      }
      window.addEventListener('click', handleUserInteraction)
      window.addEventListener('keydown', handleUserInteraction)
      window.addEventListener('touchstart', handleUserInteraction)
    })
  }

  public pauseMusic() {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
    }
  }

  // --- Sound Effects (Web Audio API Synthesizer) ---

  public playClick() {
    if (!this.soundEnabled) return
    this.initAudioCtx()
    if (!this.audioCtx) return

    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start()
    osc.stop(this.audioCtx.currentTime + 0.05)
  }

  public playMove() {
    if (!this.soundEnabled) return
    this.initAudioCtx()
    if (!this.audioCtx) return

    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, this.audioCtx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start()
    osc.stop(this.audioCtx.currentTime + 0.15)
  }

  public playVictory() {
    if (!this.soundEnabled) return
    this.initAudioCtx()
    if (!this.audioCtx) return

    const now = this.audioCtx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      const osc = this.audioCtx!.createOscillator()
      const gain = this.audioCtx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.12)

      gain.gain.setValueAtTime(0.3, now + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4)

      osc.connect(gain)
      gain.connect(this.audioCtx!.destination)

      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.4)
    })
  }

  public playDeadEnd() {
    if (!this.soundEnabled) return
    this.initAudioCtx()
    if (!this.audioCtx) return

    const now = this.audioCtx.currentTime
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.3)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start(now)
    osc.stop(now + 0.3)
  }
}

export const audioManager = new AudioManager()
