'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import siteConfig from '@/src/data/config'
import { useColorMode } from '@/src/hooks/color-mode'
import useRouteChanged from '@/src/hooks/use-route-changed'
import {
  ChevronRight,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Moon,
  Package,
  ShoppingBag,
  Sun,
  User,
  X,
} from 'lucide-react'
import { Session } from 'next-auth'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { RemoveScroll } from 'react-remove-scroll'

import { useEffect } from 'react'

type MobileNavContentProps = {
  isOpen: boolean
  onClose: () => void
  session: Session | null
  onSignOut: () => void
}

// Icon mapping for navigation items
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: Home,
  Shop: ShoppingBag,
  Orders: Package,
  Services: Package,
  About: Mail,
  Contact: Mail,
}

export function MobileNavContent({
  isOpen,
  onClose,
  session,
  onSignOut,
}: MobileNavContentProps) {
  const pathname = usePathname()
  const { colorMode, toggleColorMode } = useColorMode()
  const isAuthenticated = Boolean(session?.user)
  const showDashboardLink =
    session?.user?.role && session.user.role !== 'CUSTOMER'

  useRouteChanged(onClose)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // Filter nav items (exclude Login/Sign Up if authenticated)
  const navItems = siteConfig.header.links
    .filter(
      (link) =>
        (link.label !== 'Login' && link.label !== 'Sign Up') ||
        !isAuthenticated,
    )
    .map((link) => ({
      ...link,
      icon: iconMap[link.label] || Home,
    }))

  return (
    <RemoveScroll forwardProps>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      >
        <MotionBox
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl overflow-hidden"
        >
          <div className="flex h-full flex-col">
            {/* Header with Logo */}
            <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Total Supply"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Total Supply</h2>
                  <p className="text-xs text-muted-foreground">Navigation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 active:scale-95"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile Section (if authenticated) */}
            {isAuthenticated && session?.user && (
              <div className="border-b border-border p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || 'User'}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-base font-semibold text-primary">
                      {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {session.user.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <a
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center justify-between w-full rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <span>View Profile</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            )}

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href || ''))
                const Icon = item.icon

                return (
                  <a
                    key={index}
                    href={item.href || `/#${item.id}`}
                    onClick={onClose}
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                          : 'bg-muted group-hover:bg-muted/70 group-hover:scale-105'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-base flex-1">{item.label}</span>
                    {isActive && (
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </a>
                )
              })}

              {/* Authenticated User Links */}
              {isAuthenticated && (
                <>
                  <div className="h-px bg-border my-3" />

                  <a
                    href="/wishlist"
                    onClick={onClose}
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                      pathname === '/wishlist'
                        ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                        pathname === '/wishlist'
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                          : 'bg-muted group-hover:bg-muted/70 group-hover:scale-105'
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                    </div>
                    <span className="text-base flex-1">Wishlist</span>
                  </a>

                  {showDashboardLink && (
                    <a
                      href="/dashboard"
                      onClick={onClose}
                      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                        pathname === '/dashboard'
                          ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                          pathname === '/dashboard'
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                            : 'bg-muted group-hover:bg-muted/70 group-hover:scale-105'
                        }`}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                      </div>
                      <span className="text-base flex-1">Dashboard</span>
                    </a>
                  )}
                </>
              )}
            </nav>

            {/* Footer Actions */}
            <div className="border-t border-border p-4 space-y-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleColorMode}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 active:scale-98"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  {colorMode === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </div>
                <span className="text-base flex-1 text-left">
                  {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>

              {/* Sign Out Button */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onClose()
                    onSignOut()
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-98"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="text-base flex-1 text-left font-medium">
                    Sign Out
                  </span>
                </button>
              )}

              {/* Copyright */}
              <div className="rounded-lg bg-muted/50 p-3 text-center mt-2">
                <p className="text-xs text-muted-foreground">
                  © 2026 Total Supply. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </MotionBox>
      </MotionBox>
    </RemoveScroll>
  )
}
