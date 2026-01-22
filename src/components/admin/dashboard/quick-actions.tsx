'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Package, Settings, ShoppingBag, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      label: 'Manage Users',
      icon: Users,
      href: '/dashboard/admin/users',
      color: 'blue',
    },
    {
      label: 'View Orders',
      icon: ShoppingBag,
      href: '/dashboard/admin/orders',
      color: 'green',
    },
    {
      label: 'Catalog Items',
      icon: Package,
      href: '/dashboard/admin/catalog/items',
      color: 'purple',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/admin/settings',
      color: 'amber',
    },
  ]

  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            onClick={() => router.push(action.href)}
            className="flex flex-col items-center gap-2 h-auto py-4 hover:scale-105 transition-transform"
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </MotionBox>
  )
}
