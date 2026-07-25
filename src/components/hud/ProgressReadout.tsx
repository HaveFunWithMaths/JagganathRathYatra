import { useProgress } from '../../state/selectors'

export function ProgressReadout() {
  const { done, total } = useProgress()
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between font-display tabular-nums text-cyan-100">
        <span className="text-xs uppercase tracking-widest text-cyan-100/50">Progress</span>
        <span className="text-lg font-bold">
          {done} / {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-void-2">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%`, boxShadow: '0 0 10px var(--color-gold)' }}
        />
      </div>
    </div>
  )
}
