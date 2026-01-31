'use client'

import { MotionBox } from '@/src/components/motion/box'
import siteConfig from '@/src/data/config'
import { useColorMode } from '@/src/hooks/color-mode'
import useRouteChanged from '@/src/hooks/use-route-changed'
import { Info, Mail, Moon, Phone, Sun, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { RemoveScroll } from 'react-remove-scroll'

import { useEffect } from 'react'

type MobileNavContentProps = {
  isOpen: boolean
  onClose: () => void
}

export function MobileNavContent({ isOpen, onClose }: MobileNavContentProps) {
  const pathname = usePathname()
  const { colorMode, toggleColorMode } = useColorMode()

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

  // const navItems = siteConfig.header.primaryNav

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
          className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Total Supply"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    quality={75}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Total Supply</h2>
                  <p className="text-xs text-muted-foreground">Menu</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            {/* <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'bg-muted group-hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-base">{item.label}</span>
                    {isActive && (
                      <div className="absolute right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </a>
                )
              })}
            </nav> */}

            {/* Footer Actions */}
            <div className="border-t border-border p-4 space-y-3">
              <button
                onClick={toggleColorMode}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  {colorMode === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </div>
                <span className="text-base">
                  {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>

              {/* Contact Info */}
              <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <a
                    href="tel:+94771234567"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +94 77 123 4567
                  </a>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  © 2026 Total Supply
                </p>
              </div>
            </div>
          </div>
        </MotionBox>
      </MotionBox>
    </RemoveScroll>
  )
}
