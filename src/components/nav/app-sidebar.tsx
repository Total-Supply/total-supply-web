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
    isActive: true,
    roles: ['ADMIN', 'SALESMAN', 'DRIVER', 'CLEANER', 'IT_STAFF'],
  },
  {
    title: 'Orders',
    url: '/dashboard/admin/orders',
    icon: ShoppingBasket,
    roles: ['ADMIN'],
    items: [
      {
        title: 'All Orders',
        url: '/dashboard/admin/orders',
      },
      {
        title: 'Order Tracking',
        url: '/orders',
      },
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
      },
      {
        title: 'Service Offerings',
        url: '/dashboard/admin/services/offerings',
      },
      {
        title: 'Customer Requests',
        url: '/services/requests',
      },
    ],
  },
  {
    title: 'IT Services',
    url: '/dashboard/it',
    icon: Wrench,
    roles: ['IT_STAFF'],
    items: [
      {
        title: 'My IT Services',
        url: '/dashboard/it',
      },
      {
        title: 'Tickets',
        url: '/dashboard/it/tickets',
      },
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
        url: '/dashboard/admin/users',
      },
      {
        title: 'All Users',
        url: '/dashboard/admin/users',
      },
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
      },
      {
        title: 'Categories',
        url: '/dashboard/admin/catalog/categories',
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()
  if (status !== 'authenticated') {
    return null
  }

  const role = (session.user as { role?: string })?.role || 'CUSTOMER'
  const user = {
    name: session.user?.name || 'Total Supply User',
    email: session.user?.email || 'support@totalsupply.com',
    avatar: session.user?.image || '/images/logo/logo.png',
  }
  const filteredMain = navMain.filter((item) => item.roles?.includes(role))
  const filteredSecondary = navSecondary.filter((item) =>
    item.roles?.includes(role),
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ShoppingBasket className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Total Supply</span>
                  <span className="truncate text-xs">Admin Console</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMain} />
        <NavSecondary items={filteredSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
