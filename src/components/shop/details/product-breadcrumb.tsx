import { ChevronRight, Home, Store } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { FoodItemDetail } from '../types'

type ProductBreadcrumbProps = {
  item: FoodItemDetail
}

export function ProductBreadcrumb({ item }: ProductBreadcrumbProps) {
  const router = useRouter()

  return (
    <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto scrollbar-hide pb-2">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap flex-shrink-0"
      >
        <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Home</span>
      </button>
      <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
      <button
        onClick={() => router.push('/shop')}
        className="flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap flex-shrink-0"
      >
        <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span>Shop</span>
      </button>
      {item.category && (
        <>
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <button
            onClick={() =>
              router.push(`/shop?categories=${item.category?.slug}`)
            }
            className="hover:text-foreground transition-colors whitespace-nowrap flex-shrink-0"
          >
            {item.category.name}
          </button>
        </>
      )}
      <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
      <span className="font-medium text-foreground truncate max-w-[120px] sm:max-w-[200px]">
        {item.name}
      </span>
    </nav>
  )
}
