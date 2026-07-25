import { useCurrentLevel } from '../../state/selectors'

export function ModeBadge() {
  const level = useCurrentLevel()
  if (!level) return null

  return (
    <div className="flex items-center gap-2 font-display text-xs uppercase tracking-widest text-cyan-100/60">
      <span className="h-2 w-2 rounded-full bg-magenta" style={{ boxShadow: '0 0 8px var(--color-magenta)' }} />
      {level.label} Mode
    </div>
  )
}
