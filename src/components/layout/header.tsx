'use client'

import { MotionBox } from '@/src/components/motion/box'
import siteConfig from '@/src/data/config'
import { useColorMode } from '@/src/hooks/color-mode'
import { useScrollSpy } from '@/src/hooks/use-scrollspy'
import { RootState } from '@/src/store'
import { Container } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { useScroll } from 'framer-motion'
import { Menu, Moon, Package, ShoppingCart, Sun, User } from 'lucide-react'
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

  const activeId = useScrollSpy(
    siteConfig.header.links
      .filter(({ id }) => id)
      .map(({ id }) => `[id="${id}"]`),
    { threshold: 0.75 },
  )

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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {siteConfig.header.links.map(({ href, id, label }, i) => {
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
              {/* Theme Toggle */}
              <button
                onClick={toggleColorMode}
                className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
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
                className="relative flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="View cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <a
                href="/profile"
                className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Profile"
              >
                <User className="h-4 w-4" />
              </a>

              {/* Orders */}
              <Link
                href="/orders"
                className="hidden md:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Orders"
              >
                <Package className="h-4 w-4" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={mobileNav.onOpen}
                className="flex lg:hidden items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
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
