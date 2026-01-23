import { ChevronRight, Home, Store } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { FoodItemDetail } from '../types'

type ProductBreadcrumbProps = {
  item: FoodItemDetail
}

export function ProductBreadcrumb({ item }: ProductBreadcrumbProps) {
  const router = useRouter()

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        Home
      </button>
      <ChevronRight className="h-4 w-4" />
      <button
        onClick={() => router.push('/shop')}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Store className="h-4 w-4" />
        Shop
      </button>
      {item.category && (
        <>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() =>
              router.push(`/shop?categories=${item.category?.slug}`)
            }
            className="hover:text-foreground transition-colors"
          >
            {item.category.name}
          </button>
        </>
      )}
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground truncate max-w-[200px]">
        {item.name}
      </span>
    </nav>
  )
}
