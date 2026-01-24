'use client'

import { Text } from '@chakra-ui/react'
import { Check, Package } from 'lucide-react'

type ServiceOffering = {
  id: number
  name: string
  description?: string | null
  basePrice?: number | null
  category?: string | null
  type: 'CLEANING' | 'IT_SUPPORT'
}

type ServiceOfferingsGridProps = {
  offerings: ServiceOffering[]
  selectedId: number | string
  onSelect: (offering: ServiceOffering) => void
}

export function ServiceOfferingsGrid({
  offerings,
  selectedId,
  onSelect,
}: ServiceOfferingsGridProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Package className="h-4 w-4 text-primary" />
        </div>
        <Text fontSize="lg" fontWeight="600">
          Select Service Package
        </Text>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {offerings.map((offering) => {
          const isSelected = selectedId === offering.id
          return (
            <button
              key={offering.id}
              onClick={() => onSelect(offering)}
              className={`group relative rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                  : 'border-border/60 hover:border-primary/50'
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <Text fontWeight="600" fontSize="md" className="pr-8">
                  {offering.name}
                </Text>

                {offering.description && (
                  <Text
                    fontSize="sm"
                    color="muted"
                    className="line-clamp-2"
                    lineHeight="relaxed"
                  >
                    {offering.description}
                  </Text>
                )}

                {offering.basePrice != null &&
                  !isNaN(Number(offering.basePrice)) && (
                    <Text fontSize="lg" fontWeight="700" color="primary">
                      LKR {Number(offering.basePrice).toFixed(2)}
                    </Text>
                  )}

                {offering.category && (
                  <span className="inline-block rounded-full bg-muted/50 px-3 py-1 text-xs font-medium uppercase">
                    {offering.category.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {/* Hover Effect Overlay */}
              <div
                className={`absolute inset-0 rounded-2xl transition-opacity ${
                  isSelected
                    ? 'bg-primary/5'
                    : 'bg-primary/0 group-hover:bg-primary/5'
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
