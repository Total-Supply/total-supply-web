import { Package, ShoppingBag } from 'lucide-react'

type OrderItem = {
  id: number
  quantity: number
  unitPrice: number | string
  foodItem: {
    id: number
    name: string
    image?: string | null
  }
}

type OrderItemsProps = {
  items: OrderItem[]
  notes?: string | null
  className?: string
}

export function OrderItems({ items, notes, className = '' }: OrderItemsProps) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  )

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 ring-1 ring-orange-500/30">
          <ShoppingBag className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Order Items</h3>
          <p className="text-xs text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex gap-3 rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3 transition-all duration-200 hover:shadow-md hover:border-border"
          >
            {/* Product Image */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
              {item.foodItem.image ? (
                <img
                  src={item.foodItem.image}
                  alt={item.foodItem.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold line-clamp-2 mb-1">
                  {item.foodItem.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Qty: {item.quantity}</span>
                  <span>•</span>
                  <span>LKR {Number(item.unitPrice).toFixed(2)} each</span>
                </div>
              </div>
              <p className="text-sm font-bold tabular-nums mt-2">
                LKR {(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Subtotal
          </span>
          <span className="text-lg font-bold tabular-nums">
            LKR {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Order Notes */}
      {notes && (
        <div className="mt-6 pt-6 border-t border-border/60">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            Order Notes
          </h4>
          <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
            <p className="text-sm text-muted-foreground">{notes}</p>
          </div>
        </div>
      )}
    </div>
  )
}
