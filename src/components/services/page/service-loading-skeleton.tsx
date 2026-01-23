'use client'

export function ServiceLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Service Packages Skeleton */}
      <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
        {/* Title Skeleton */}
        <div className="mb-4 h-6 w-48 animate-pulse rounded-lg bg-muted" />

        {/* Grid of Package Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-border/60 p-4 space-y-3"
            >
              {/* Package Name */}
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              {/* Description Lines */}
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted/70" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted/70" />
              </div>
              {/* Price */}
              <div className="h-6 w-24 animate-pulse rounded bg-muted" />
              {/* Category Badge */}
              <div className="h-6 w-32 animate-pulse rounded-full bg-muted/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
        {/* Form Title */}
        <div className="h-6 w-40 animate-pulse rounded-lg bg-muted" />

        {/* Form Fields */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-muted/70" />
            </div>
          ))}
        </div>

        {/* Text Area Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-32 w-full animate-pulse rounded-lg bg-muted/70" />
        </div>

        {/* Photo Upload Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 w-24 animate-pulse rounded-lg bg-muted/70"
              />
            ))}
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-end gap-3">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-primary/30" />
        </div>
      </div>
    </div>
  )
}
