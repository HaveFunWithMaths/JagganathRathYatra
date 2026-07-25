import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

interface PanZoomContainerProps {
  enabled: boolean
  children: ReactNode
  className?: string
}

const MIN_SCALE = 1
const MAX_SCALE = 3

/**
 * Optional comfort feature for mobile Hard mode (Section 8): pinch-to-zoom and
 * single-finger pan once zoomed in. Disabled entirely (renders children as-is)
 * when `enabled` is false, since viewBox scaling alone is sufficient elsewhere.
 */
export function PanZoomContainer({ enabled, children, className }: PanZoomContainerProps) {
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null)
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)

  if (!enabled) return <div className={`h-full w-full ${className ?? ''}`}>{children}</div>

  function distanceBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  function clampScale(s: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinchStart.current = { dist: distanceBetween(a, b), scale: transform.scale }
      panStart.current = null
    } else if (pointers.current.size === 1 && transform.scale > 1) {
      panStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y }
    }
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()]
      const dist = distanceBetween(a, b)
      const scale = clampScale(pinchStart.current.scale * (dist / pinchStart.current.dist))
      setTransform((t) => ({ ...t, scale }))
    } else if (pointers.current.size === 1 && panStart.current) {
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      setTransform((t) => ({ ...t, x: panStart.current!.tx + dx, y: panStart.current!.ty + dy }))
    }
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
    if (pointers.current.size === 0) panStart.current = null
  }

  function reset() {
    setTransform({ scale: 1, x: 0, y: 0 })
  }

  return (
    <div className={`relative h-full w-full touch-none ${className ?? ''}`}>
      <div
        className="h-full w-full overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="h-full w-full"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: 'center center',
            transition: pointers.current.size > 0 ? 'none' : 'transform 150ms ease-out',
          }}
        >
          {children}
        </div>
      </div>
      {transform.scale > 1.02 && (
        <button
          onClick={reset}
          className="absolute bottom-3 right-3 rounded-full border border-cyan-400/50 bg-black/60 px-3 py-1.5 font-display text-xs text-cyan-200 backdrop-blur"
        >
          Reset view
        </button>
      )}
    </div>
  )
}
