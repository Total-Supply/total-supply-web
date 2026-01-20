type CategoryBadgeProps = {
  name: string
  isPrimary?: boolean
  className?: string
}

export function CategoryBadge({
  name,
  isPrimary = false,
  className,
}: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
        isPrimary
          ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
          : 'bg-muted text-muted-foreground ring-1 ring-border'
      } ${className || ''}`}
    >
      {name}
    </span>
  )
}
