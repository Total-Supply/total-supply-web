import { MotionBox } from '@/src/components/motion/box'
import { Filter, Package, Search, Sparkles } from 'lucide-react'

import { Button } from '../ui/button'

type ShopEmptyStateProps = {
  hasFilters: boolean
  searchQuery?: string
  onClearFilters: () => void
}

export function ShopEmptyState({
  hasFilters,
  searchQuery,
  onClearFilters,
}: ShopEmptyStateProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border-2 border-dashed border-border/60 bg-gradient-to-br from-muted/20 to-muted/10 p-12 text-center"
    >
      <div className="mx-auto max-w-md space-y-6">
        {/* Icon */}
        <div className="relative mx-auto w-fit">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            {searchQuery ? (
              <Search className="h-10 w-10 text-primary" />
            ) : (
              <Package className="h-10 w-10 text-primary" />
            )}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {searchQuery ? 'No Results Found' : 'No Products Available'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery ? (
              <>
                We couldn&#39;t find any products matching &quot;
                <strong>{searchQuery}</strong>&quot;. Try adjusting your search
                or filters.
              </>
            ) : hasFilters ? (
              'No products match your current filters. Try adjusting them to see more results.'
            ) : (
              'There are currently no products available in this category.'
            )}
          </p>
        </div>

        {/* Suggestions */}
        {(searchQuery || hasFilters) && (
          <div className="rounded-xl border border-border/60 bg-card p-6 text-left">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold mb-2">Suggestions:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Check your spelling and try again</li>
                  <li>• Use more general keywords</li>
                  <li>• Try different category combinations</li>
                  <li>• Adjust your price range</li>
                </ul>
              </div>
            </div>

            {hasFilters && (
              <Button
                onClick={onClearFilters}
                colorPalette="primary"
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </MotionBox>
  )
}
