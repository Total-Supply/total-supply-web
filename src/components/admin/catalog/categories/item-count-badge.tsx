type ItemCountBadgeProps = {
  count: number
  className?: string
}

const getCountStyle = (count: number) => {
  if (count === 0) {
    return 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30'
  }
  if (count <= 5) {
    return 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
  }
  if (count <= 20) {
    return 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40'
  }
  return 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
}

export function ItemCountBadge({ count, className }: ItemCountBadgeProps) {
  const style = getCountStyle(count)

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${style} ${className || ''}`}
    >
      {count} {count === 1 ? 'item' : 'items'}
    </span>
  )
}
