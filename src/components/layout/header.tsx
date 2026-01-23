'use client'

import { MotionBox } from '@/src/components/motion/box'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import siteConfig from '@/src/data/config'
import { useColorMode } from '@/src/hooks/color-mode'
import { useScrollSpy } from '@/src/hooks/use-scrollspy'
import { RootState } from '@/src/store'
import { Container } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { useScroll } from 'framer-motion'
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  ShoppingCart,
  Sun,
  User,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'

import { useEffect, useRef, useState } from 'react'

import { CartDrawerEnhanced } from '../cart/cart-drawer'
import { MobileNavContent } from '../mobile-nav'

export function HeaderEnhanced() {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)
  const [height, setHeight] = useState(0)
  const { scrollY } = useScroll()
  const { colorMode, toggleColorMode } = useColorMode()
  const pathname = usePathname()
  const mobileNav = useDisclosure()
  const cartDrawer = useDisclosure()
  const { data: session } = useSession()
  // const primaryNav = siteConfig.header?.primaryNav ?? []
  const activeId = useScrollSpy(
    siteConfig.header.links
      .filter(({ id }) => id)
      .map(({ id }) => `[id="${id}"]`),
    { threshold: 0.75 },
  )
  const isAuthenticated = Boolean(session?.user)
  const showDashboardLink =
    session?.user?.role && session.user.role !== 'CUSTOMER'
  const navLinks = siteConfig.header.links.filter(
    (link) =>
      (link.label !== 'Login' && link.label !== 'Sign Up') || !isAuthenticated,
  )
  const handleSignOut = () =>
    signOut({ callbackUrl: pathname === '/' ? '/' : '/services' })

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  )

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height)
    }
  }, [])

  useEffect(() => {
    return scrollY.on('change', () => setY(scrollY.get()))
  }, [scrollY])

  const isScrolled = y > height

  return (
    <>
      <MotionBox
        ref={ref}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-border/60 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <Container maxW="container.2xl" className="px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="flex items-center gap-3 group"
            >
              <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-xl overflow-hidden ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-105">
                <Image
                  src="/images/logo/logo.png"
                  alt="Total Supply Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Total Supply
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">
                  Fresh & Fast
                </p>
              </div>
            </Link>

            {/* Primary navigation */}
            {/* <nav className="hidden lg:flex items-center gap-4 mr-3">
              {primaryNav.map(({ href, label, icon: Icon }, i) => {
                const isActive = href ? pathname?.startsWith(href) : false

                return (
                  <a
                    key={i}
                    href={href}
                    className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-all duration-200 ${
                      isActive ? 'text-primary' : 'hover:text-foreground'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" aria-hidden />}
                    {label}
                  </a>
                )
              })}
            </nav> */}

            {/* Section navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, id, label }, i) => {
                const linkHref = href || `/#${id}`
                const isActive =
                  (id && activeId === id) ||
                  (href && pathname?.match(new RegExp(href)))

                return (
                  <a
                    key={i}
                    href={linkHref}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <MotionBox
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ${
                        isActive ? 'w-3/4' : 'w-0 group-hover:w-1/2'
                      }`}
                    />
                  </a>
                )
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Link
                  href="/services"
                  className="hidden lg:inline-flex items-center rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary transition-all duration-200 hover:text-primary/80 hover:scale-105"
                >
                  Ready to Get Started?
                </Link>
              )}
              {/* Theme Toggle */}
              <button
                onClick={toggleColorMode}
                className="hidden cursor-pointer sm:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Toggle theme"
              >
                {colorMode === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={cartDrawer.onOpen}
                className="relative cursor-pointer flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="View cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="hidden cursor-pointer sm:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Account"
                    >
                      <User className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel inset>
                      {session?.user?.name || 'Account'}
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild inset>
                        <Link
                          href="/profile"
                          className="flex cursor-pointer items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild inset>
                        <Link
                          href="/orders"
                          className="flex cursor-pointer items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Package className="h-4 w-4 text-muted-foreground" />
                          My orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild inset>
                        <Link
                          href="/wishlist"
                          className="flex cursor-pointer items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          Wish list
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {showDashboardLink && (
                      <>
                        <DropdownMenuItem asChild inset>
                          <Link
                            href="/dashboard"
                            className="flex cursor-pointer items-center gap-2 text-sm hover:text-primary transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      inset
                      variant="destructive"
                      onSelect={(event) => {
                        event.preventDefault()
                        handleSignOut()
                      }}
                      className="hover:text-destructive cursor-pointer transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label="Log in"
                >
                  <User className="h-4 w-4" />
                </Link>
              )}

              {/* Orders */}
              {/* <Link
                href="/orders"
                className="hidden md:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Orders"
              >
                <Package className="h-4 w-4" />
              </Link> */}

              {/* Mobile Menu Button */}
              <button
                onClick={mobileNav.onOpen}
                className="flex lg:hidden items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </MotionBox>

      {/* Mobile Navigation Drawer */}
      <MobileNavContent isOpen={mobileNav.open} onClose={mobileNav.onClose} />

      {/* Cart Drawer */}
      <CartDrawerEnhanced
        isOpen={cartDrawer.open}
        onClose={cartDrawer.onClose}
      />
    </>
  )
}
