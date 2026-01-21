'use client'

import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  Truck,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'

const navMain = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'SALESMAN', 'DRIVER', 'CLEANER', 'IT_STAFF'],
  },
  {
    title: 'Orders',
    url: '/dashboard/admin/orders',
    icon: ShoppingBasket,
    roles: ['ADMIN'],
    items: [
      { title: 'All Orders', url: '/dashboard/admin/orders', roles: ['ADMIN'] },
      { title: 'Order Tracking', url: '/orders', roles: ['ADMIN'] },
    ],
  },
  {
    title: 'My Orders',
    url: '/dashboard/salesman',
    icon: Truck,
    roles: ['SALESMAN'],
    items: [
      {
        title: 'Assigned Queue',
        url: '/dashboard/salesman',
        roles: ['SALESMAN'],
      },
    ],
  },
  {
    title: 'Services',
    url: '/dashboard/admin/services',
    icon: Wrench,
    roles: ['ADMIN'],
    items: [
      {
        title: 'Service Requests',
        url: '/dashboard/admin/services',
        roles: ['ADMIN'],
      },
      {
        title: 'Service Offerings',
        url: '/dashboard/admin/services/offerings',
        roles: ['ADMIN'],
      },
      {
        title: 'Customer Requests',
        url: '/services/requests',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    title: 'IT Services',
    url: '/dashboard/it',
    icon: Wrench,
    roles: ['IT_STAFF'],
    items: [
      { title: 'My IT Services', url: '/dashboard/it', roles: ['IT_STAFF'] },
      { title: 'Tickets', url: '/dashboard/it/tickets', roles: ['IT_STAFF'] },
    ],
  },
  {
    title: 'Users',
    url: '/dashboard/admin/users',
    icon: Users,
    roles: ['ADMIN'],
    items: [
      {
        title: 'Approval Queue',
        url: '/dashboard/admin/users/approvals',
        roles: ['ADMIN'],
      },
      { title: 'All Users', url: '/dashboard/admin/users', roles: ['ADMIN'] },
    ],
  },
  {
    title: 'Catalog',
    url: '/dashboard/admin/catalog/items',
    icon: ClipboardList,
    roles: ['ADMIN'],
    items: [
      {
        title: 'Items',
        url: '/dashboard/admin/catalog/items',
        roles: ['ADMIN'],
      },
      {
        title: 'Categories',
        url: '/dashboard/admin/catalog/categories',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    title: 'Analytics',
    url: '/dashboard/admin/analytics',
    icon: BarChart3,
    roles: ['ADMIN'],
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/admin/analytics',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    title: 'Audit Logs',
    url: '/dashboard/admin/audit-logs',
    icon: ShieldCheck,
    roles: ['ADMIN'],
    items: [
      {
        title: 'All Logs',
        url: '/dashboard/admin/audit-logs',
        roles: ['ADMIN'],
      },
    ],
  },
]

const navSecondary = [
  {
    title: 'Profile',
    url: '/dashboard/profile',
    icon: User,
    roles: ['ADMIN', 'SALESMAN', 'DRIVER', 'CLEANER', 'IT_STAFF', 'CUSTOMER'],
  },
  {
    title: 'Help Center',
    url: '/support',
    icon: LifeBuoy,
    roles: ['ADMIN', 'SALESMAN', 'DRIVER', 'CLEANER', 'IT_STAFF', 'CUSTOMER'],
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    roles: ['ADMIN', 'SALESMAN', 'DRIVER', 'CLEANER', 'IT_STAFF'],
  },
]

interface NavItem {
  title: string
  url: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  roles: string[]
  items?: NavItem[]
}

function computeActive(pathname: string, item: NavItem) {
  if (pathname === item.url) return true
  if (pathname.startsWith(item.url + '/')) return true
  if (item.items?.some((child: NavItem) => pathname === child.url)) return true
  return false
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Move hooks above conditional return
  const role = (session?.user as { role?: string })?.role || 'CUSTOMER'

  const user = {
    name: session?.user?.name || 'Total Supply User',
    email: session?.user?.email || 'support@totalsupply.com',
    avatar: session?.user?.image || '/images/logo/logo.png',
  }

  const filteredMain = React.useMemo(() => {
    return navMain
      .filter((item) => item.roles?.includes(role))
      .map((item) => ({
        ...item,
        isActive: computeActive(pathname, item),
      }))
  }, [pathname, role])

  const filteredSecondary = React.useMemo(() => {
    return navSecondary.filter((item) => item.roles?.includes(role))
  }, [role])

  if (status !== 'authenticated') return null

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader className="py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="group gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 hover:bg-sidebar-accent/50"
            >
              <Link href="/dashboard">
                {/* Brand Icon */}
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 group-hover:rotate-[2deg]">
                  <ShoppingBasket className="size-4 transition-transform duration-200 group-hover:scale-110" />
                </div>

                {/* Text */}
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-[13px] font-semibold tracking-tight">
                    Total Supply
                  </span>
                  <span className="truncate text-[11px] text-sidebar-foreground/70">
                    Admin Console
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-1">
        <div className="px-2">
          <NavMain items={filteredMain} />
        </div>

        <div className="mt-auto px-2 pb-2">
          <NavSecondary items={filteredSecondary} className="pt-3" />
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border/60 px-2 py-2">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
