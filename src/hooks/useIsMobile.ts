import { useEffect, useState } from 'react'

const QUERY = '(max-width: 767px)'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])

  return isMobile
}
