import { useEffect, useRef } from 'react'
import { gsap } from '../../animation/gsap'

const PARTICLE_COUNT = 18

/** Radial burst of neon particles, played once on mount (victory sequence, Section 7.5). */
export function ParticleBurst() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const particles = Array.from(container.children) as HTMLElement[]

    particles.forEach((el, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2
      const distance = 90 + Math.random() * 90
      gsap.fromTo(
        el,
        { x: 0, y: 0, opacity: 1, scale: 0.4 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 1,
          duration: 0.9 + Math.random() * 0.4,
          ease: 'power2.out',
          delay: 0.05,
        },
      )
    })
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: i % 2 === 0 ? 'var(--color-gold)' : 'var(--color-cyan)',
            boxShadow: `0 0 10px ${i % 2 === 0 ? 'var(--color-gold)' : 'var(--color-cyan)'}`,
          }}
        />
      ))}
    </div>
  )
}
