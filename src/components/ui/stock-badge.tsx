type StockBadgeProps = {
  stock: number
  className?: string
}

const getStockStyle = (stock: number) => {
  if (stock === 0) {
    return 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40'
  }
  if (stock <= 10) {
    return 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
  }
  return 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
}

const getStockLabel = (stock: number) => {
  if (stock === 0) return 'Out of Stock'
  if (stock <= 10) return 'Low Stock'
  return 'In Stock'
}

export function StockBadge({ stock, className }: StockBadgeProps) {
  const style = getStockStyle(stock)

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${style} ${className || ''}`}
    >
      <span className="text-xs">{stock}</span>
      <span className="hidden sm:inline">• {getStockLabel(stock)}</span>
    </span>
  )
}
