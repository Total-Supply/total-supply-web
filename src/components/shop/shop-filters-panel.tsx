import { MotionBox } from '@/src/components/motion/box'
import { DollarSign, Filter, Tag, X } from 'lucide-react'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import type { CategoryFilter } from './types'

type ShopFiltersPanelProps = {
  categories: CategoryFilter[]
  selectedCategories: string[]
  onToggleCategory: (slug: string) => void
  onClearFilters: () => void
  minPrice: number
  maxPrice: number
  priceRangeMin: number
  priceRangeMax: number
  onPriceChange: (min: number, max: number) => void
  onResetPrice: () => void
  isVisible: boolean
}

export function ShopFiltersPanel({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearFilters,
  minPrice,
  maxPrice,
  priceRangeMin,
  priceRangeMax,
  onPriceChange,
  onResetPrice,
  isVisible,
}: ShopFiltersPanelProps) {
  const hasPriceFilter =
    minPrice !== priceRangeMin || maxPrice !== priceRangeMax

  return (
    <div
      className={`space-y-6 ${
        isVisible ? 'block' : 'hidden lg:block'
      } lg:sticky lg:top-24 lg:self-start`}
    >
      {/* Categories Filter */}
      <MotionBox
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Categories</h3>
          </div>
          {selectedCategories.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`group flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
                selectedCategories.includes(category.slug)
                  ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm'
                  : 'border-border/60 bg-gradient-to-br from-card/50 to-card/30 hover:border-border hover:shadow-sm'
              }`}
            >
              <Checkbox
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => onToggleCategory(category.slug)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{category.name}</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {category.itemCount}
              </span>
            </label>
          ))}
        </div>

        {/* Selected Category Tags */}
        {selectedCategories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground mb-2">
              {selectedCategories.length} selected
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((slug) => {
                const category = categories.find((c) => c.slug === slug)
                return (
                  <button
                    key={slug}
                    onClick={() => onToggleCategory(slug)}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    {category?.name || slug}
                    <X className="h-3 w-3" />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </MotionBox>

      {/* Price Range Filter */}
      <MotionBox
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold">Price Range</h3>
          </div>
          {hasPriceFilter && (
            <Button variant="ghost" size="sm" onClick={onResetPrice}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Price Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Min Price</label>
              <input
                type="number"
                min={priceRangeMin}
                max={maxPrice}
                value={minPrice}
                onChange={(e) => {
                  const value = Math.max(
                    priceRangeMin,
                    Math.min(maxPrice, Number(e.target.value)),
                  )
                  onPriceChange(value, maxPrice)
                }}
                className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Max Price</label>
              <input
                type="number"
                min={minPrice}
                max={priceRangeMax}
                value={maxPrice}
                onChange={(e) => {
                  const value = Math.max(
                    minPrice,
                    Math.min(priceRangeMax, Number(e.target.value)),
                  )
                  onPriceChange(minPrice, value)
                }}
                className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4">
            <div className="relative h-2 bg-muted rounded-full">
              <div
                className="absolute h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                style={{
                  left: `${((minPrice - priceRangeMin) / (priceRangeMax - priceRangeMin)) * 100}%`,
                  right: `${100 - ((maxPrice - priceRangeMin) / (priceRangeMax - priceRangeMin)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Range Display */}
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-sm font-semibold">
              LKR {minPrice.toFixed(2)} - LKR {maxPrice.toFixed(2)}
            </p>
          </div>

          {/* Quick Price Filters */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Quick Filters</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Under 500', min: 0, max: 500 },
                { label: '500-1000', min: 500, max: 1000 },
                { label: '1000-2500', min: 1000, max: 2500 },
                { label: '2500+', min: 2500, max: priceRangeMax },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => onPriceChange(range.min, range.max)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    minPrice === range.min && maxPrice === range.max
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/60 bg-card hover:bg-muted'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </MotionBox>

      {/* Filter Info */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground text-center">
          💡 Use filters to find exactly what you&#39;re looking for
        </p>
      </div>
    </div>
  )
}
