import { CheckCircle2, Package } from 'lucide-react'

type ServiceOfferingOption = {
  id: number
  name: string
  description?: string | null
  basePrice?: number | null
  category?: string | null
}

type ServiceOfferingCardProps = {
  offering: ServiceOfferingOption
  isSelected: boolean
  onSelect: () => void
}

export function ServiceOfferingCard({
  offering,
  isSelected,
  onSelect,
}: ServiceOfferingCardProps) {
  const basePrice =
    typeof offering.basePrice === 'number'
      ? offering.basePrice
      : Number.isFinite(Number(offering.basePrice ?? NaN))
      ? Number(offering.basePrice)
      : undefined
  return (
    <button
      onClick={onSelect}
      className={`relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20'
          : 'border-border/60 bg-gradient-to-br from-card/50 to-card/30 hover:border-border hover:shadow-md'
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
          isSelected
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'bg-gradient-to-br from-muted to-muted/50 text-muted-foreground'
        }`}
      >
        <Package className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold">{offering.name}</h4>
          {isSelected && (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
          )}
        </div>

        {offering.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {offering.description}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          {typeof basePrice === 'number' && (
            <span className="text-sm font-bold text-primary tabular-nums">
              LKR {basePrice.toFixed(2)}
            </span>
          )}
          {offering.category && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              {offering.category.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-primary pointer-events-none" />
      )}
    </button>
  )
}
