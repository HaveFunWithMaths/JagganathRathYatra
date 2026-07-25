import { useEffect, useRef } from 'react'
import type { EdgeVisualState } from '../components/graph/Edge'
import { gsap } from './gsap'

/**
 * One-shot GSAP flash when an edge commits to 'traversed' — the loop pulses
 * for idle/legal are cheap continuous CSS animations; this hook only drives
 * the discrete state-change moment GSAP is suited for.
 */
export function useEdgeTransition(ref: React.RefObject<SVGPathElement | null>, state: EdgeVisualState) {
  const prev = useRef(state)

  useEffect(() => {
    if (prev.current !== state && state === 'traversed' && ref.current) {
      gsap.fromTo(
        ref.current,
        { strokeWidth: 11, opacity: 1 },
        { strokeWidth: 4.5, duration: 0.55, ease: 'elastic.out(1, 0.6)' },
      )
    }
    prev.current = state
  }, [state, ref])
}
