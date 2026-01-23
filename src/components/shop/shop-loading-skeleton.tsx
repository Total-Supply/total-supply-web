type ShopLoadingSkeletonProps = {
  count?: number
}

export function ShopLoadingSkeleton({ count = 12 }: ShopLoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 animate-pulse" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />

            {/* Price */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 bg-muted rounded w-20 animate-pulse" />
              <div className="h-4 bg-muted rounded w-16 animate-pulse" />
            </div>

            {/* Button */}
            <div className="h-9 bg-muted rounded-lg animate-pulse md:hidden" />
          </div>
        </div>
      ))}
    </div>
  )
}
