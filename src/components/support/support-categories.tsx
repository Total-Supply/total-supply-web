'use client'

import { MotionBox } from '@/src/components/motion/box'
import {
  CreditCard,
  HelpCircle,
  Settings,
  Shield,
  ShoppingBag,
  Truck,
} from 'lucide-react'

type Category = {
  id: string
  title: string
  description: string
  icon: React.ElementType
  articleCount: number
}

const categories: Category[] = [
  {
    id: 'orders',
    title: 'Orders & Purchases',
    description: 'Track orders, returns, and refunds',
    icon: ShoppingBag,
    articleCount: 12,
  },
  {
    id: 'payments',
    title: 'Payments & Billing',
    description: 'Payment methods and invoices',
    icon: CreditCard,
    articleCount: 8,
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    description: 'Delivery times and tracking',
    icon: Truck,
    articleCount: 10,
  },
  {
    id: 'account',
    title: 'Account Settings',
    description: 'Profile, security, and preferences',
    icon: Settings,
    articleCount: 15,
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Data protection and privacy',
    icon: Shield,
    articleCount: 6,
  },
  {
    id: 'general',
    title: 'General Help',
    description: 'Other questions and topics',
    icon: HelpCircle,
    articleCount: 20,
  },
]

type SupportCategoriesProps = {
  onCategoryClick: (categoryId: string) => void
}

export function SupportCategories({ onCategoryClick }: SupportCategoriesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => {
        const Icon = category.icon
        return (
          <MotionBox
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onCategoryClick(category.id)}
            className="group cursor-pointer rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-border hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {category.articleCount} articles
                </p>
              </div>
            </div>
          </MotionBox>
        )
      })}
    </div>
  )
}
