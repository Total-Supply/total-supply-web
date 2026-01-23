import { MotionBox } from '@/src/components/motion/box'
import {
  CreditCard,
  HelpCircle,
  Package,
  RotateCcw,
  Settings,
  ShoppingCart,
  Truck,
  UserCircle,
} from 'lucide-react'

const categories = [
  {
    id: 'orders',
    name: 'Orders',
    description: 'Track and manage your orders',
    icon: Package,
    color: 'from-blue-500/20 to-blue-600/10 text-blue-500 ring-blue-500/30',
    count: 15,
  },
  {
    id: 'payments',
    name: 'Payments',
    description: 'Payment methods and billing',
    icon: CreditCard,
    color:
      'from-emerald-500/20 to-emerald-600/10 text-emerald-500 ring-emerald-500/30',
    count: 12,
  },
  {
    id: 'delivery',
    name: 'Delivery',
    description: 'Shipping and delivery info',
    icon: Truck,
    color: 'from-amber-500/20 to-amber-600/10 text-amber-500 ring-amber-500/30',
    count: 18,
  },
  {
    id: 'returns',
    name: 'Returns',
    description: 'Returns and refunds policy',
    icon: RotateCcw,
    color:
      'from-purple-500/20 to-purple-600/10 text-purple-500 ring-purple-500/30',
    count: 10,
  },
  {
    id: 'products',
    name: 'Products',
    description: 'Product information',
    icon: ShoppingCart,
    color: 'from-pink-500/20 to-pink-600/10 text-pink-500 ring-pink-500/30',
    count: 25,
  },
  {
    id: 'account',
    name: 'Account',
    description: 'Account settings and profile',
    icon: UserCircle,
    color:
      'from-indigo-500/20 to-indigo-600/10 text-indigo-500 ring-indigo-500/30',
    count: 14,
  },
  {
    id: 'services',
    name: 'Services',
    description: 'Service requests and support',
    icon: Settings,
    color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-500 ring-cyan-500/30',
    count: 8,
  },
  {
    id: 'other',
    name: 'Other',
    description: 'General questions',
    icon: HelpCircle,
    color: 'from-slate-500/20 to-slate-600/10 text-slate-500 ring-slate-500/30',
    count: 20,
  },
]

type SupportCategoriesProps = {
  onCategoryClick: (categoryId: string) => void
  selectedCategory: string | null
}

export function SupportCategories({
  onCategoryClick,
  selectedCategory,
}: SupportCategoriesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.id
        const Icon = category.icon

        return (
          <MotionBox
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <button
              onClick={() => onCategoryClick(category.id)}
              className={`group relative w-full rounded-2xl border p-6 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20 scale-105'
                  : 'border-border/60 bg-gradient-to-br from-card/90 to-card/60 hover:border-border hover:shadow-lg hover:scale-105'
              }`}
            >
              {/* Icon */}
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ring-1 mb-4 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'} ${category.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{category.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* Article Count */}
              <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium">
                <span>{category.count}</span>
                <span className="text-muted-foreground">articles</span>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-primary pointer-events-none" />
              )}
            </button>
          </MotionBox>
        )
      })}
    </div>
  )
}
