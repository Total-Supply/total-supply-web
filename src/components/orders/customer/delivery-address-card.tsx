import { MapPin } from 'lucide-react'

type DeliveryAddress = {
  line1: string
  line2?: string | null
  city: string
  postalCode: string
  country?: string | null
}

type DeliveryAddressCardProps = {
  address: DeliveryAddress
  className?: string
}

export function DeliveryAddressCard({
  address,
  className = '',
}: DeliveryAddressCardProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
          <MapPin className="h-5 w-5 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold">Delivery Address</h3>
      </div>

      <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4 space-y-1">
        <p className="text-sm font-medium">{address.line1}</p>
        {address.line2 && (
          <p className="text-sm text-muted-foreground">{address.line2}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {address.city}, {address.postalCode}
        </p>
        {address.country && (
          <p className="text-sm text-muted-foreground">{address.country}</p>
        )}
      </div>
    </div>
  )
}
