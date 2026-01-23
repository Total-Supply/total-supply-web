import { MotionBox } from '@/src/components/motion/box'
import { Activity, Apple, Info } from 'lucide-react'

import { FoodItemDetail } from '../types'

type ProductDetailsSectionProps = {
  item: FoodItemDetail
}

export function ProductDetailsSection({ item }: ProductDetailsSectionProps) {
  const hasDetails = item.ingredients || item.nutritionInfo

  if (!hasDetails) return null

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Product Details</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ingredients */}
        {item.ingredients && (
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/30">
                <Apple className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold">Ingredients</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {item.ingredients}
            </p>
          </div>
        )}

        {/* Nutrition Info */}
        {item.nutritionInfo && (
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold">Nutrition Information</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {item.nutritionInfo}
            </p>
          </div>
        )}
      </div>
    </MotionBox>
  )
}
