'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useEffect, useRef, useState } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  const collapseDelayMs = 220

  // Find initially active item
  const initialOpenItem =
    items.find(
      (item) =>
        item.isActive ||
        pathname === item.url ||
        pathname.startsWith(item.url + '/') ||
        item.items?.some((sub) => pathname === sub.url),
    )?.title || null

  // State to track which parent item is open (only one at a time)
  const [openItem, setOpenItem] = useState<string | null>(initialOpenItem)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const handleOpenChange = (
    itemTitle: string,
    hasSubItems: boolean,
    nextOpen: boolean,
  ) => {
    if (!hasSubItems) return

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (!nextOpen) {
      if (openItem === itemTitle) {
        setOpenItem(null)
      }
      return
    }

    if (openItem && openItem !== itemTitle) {
      setOpenItem(null)
      closeTimerRef.current = setTimeout(() => {
        setOpenItem(itemTitle)
        closeTimerRef.current = null
      }, collapseDelayMs)
      return
    }

    setOpenItem(itemTitle)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-1">Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url || pathname.startsWith(item.url + '/')
          const hasSubItems = item.items && item.items.length > 0
          const isOpen = openItem === item.title

          return (
            <NavMainItem
              key={item.title}
              item={item}
              isActive={isActive}
              hasSubItems={!!hasSubItems}
              pathname={pathname}
              isOpen={isOpen}
              onOpenChange={(nextOpen) =>
                handleOpenChange(item.title, !!hasSubItems, nextOpen)
              }
            />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavMainItem({
  item,
  isActive,
  hasSubItems,
  pathname,
  isOpen,
  onOpenChange,
}: {
  item: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }
  isActive: boolean
  hasSubItems: boolean
  pathname: string
  isOpen: boolean
  onOpenChange: (nextOpen: boolean) => void
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} asChild>
      <SidebarMenuItem>
        {hasSubItems ? (
          // Clickable parent that toggles expansion
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className="group/item w-full"
            >
              <div className="flex w-full items-center gap-2.5 cursor-pointer">
                <item.icon className="transition-transform duration-200 group-hover/item:scale-110" />
                <span className="flex-1 font-medium">{item.title}</span>
                <ChevronRight
                  className={`ml-auto size-4 transition-transform duration-300 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
        ) : (
          // Regular link for items without subitems
          <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
            <Link href={item.url} className="group/link">
              <item.icon className="transition-transform duration-200 group-hover/link:scale-110" />
              <span className="font-medium">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        )}

        {hasSubItems && (
          <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-[collapsible-up_200ms_ease-out] data-[state=open]:animate-[collapsible-down_200ms_ease-out]">
            <SidebarMenuSub className="ml-0.5 mt-1 mb-1">
              {item.items?.map((subItem) => {
                const isSubActive = pathname === subItem.url

                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild isActive={isSubActive}>
                      <Link href={subItem.url} className="group/sublink">
                        <span className="relative">
                          {subItem.title}
                          {isSubActive && (
                            <span className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sidebar-accent-foreground animate-pulse" />
                          )}
                        </span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  )
}
