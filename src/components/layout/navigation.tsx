import siteConfig from '@/src/data/config'
import { useScrollSpy } from '@/src/hooks/use-scrollspy'
import { HStack } from '@chakra-ui/react'
import { useDisclosure, useUpdateEffect } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'

import * as React from 'react'

import { CartButton } from '../cart/cart-button'
import { MobileNavButton, MobileNavContent } from '../mobile-nav'
import { NavLink } from '../nav-link'
import ThemeToggle from './theme-toggle'

const Navigation: React.FC = () => {
  const mobileNav = useDisclosure()
  const router = useRouter()
  const path = usePathname()
  const activeId = useScrollSpy(
    siteConfig.header.links
      .filter(({ id }) => id)
      .map(({ id }) => `[id="${id}"]`),
    {
      threshold: 0.75,
    },
  )

  const mobileNavBtnRef = React.useRef<HTMLButtonElement>(null)

  useUpdateEffect(() => {
    mobileNavBtnRef.current?.focus()
  }, [mobileNav.open])

  return (
    <HStack gap="2" flexShrink={0}>
      {siteConfig.header.links.map(({ href, id, variant, ...props }, i) => {
        return (
          <NavLink
            display={['none', null, 'block']}
            href={href || `/#${id}`}
            key={i}
            _active={
              !!(
                (id && activeId === id) ||
                (href && !!path?.match(new RegExp(href)))
              )
                ? { color: 'teal.500', fontWeight: 'bold' }
                : undefined
            }
            // Only pass variant if it's 'underline' or 'plain'
            {...(variant === 'underline' || variant === 'plain'
              ? { variant }
              : {})}
            {...props}
          >
            {props.label}
          </NavLink>
        )
      })}

      <ThemeToggle />
      <CartButton />

      <MobileNavButton
        ref={mobileNavBtnRef}
        aria-label="Open Menu"
        onClick={mobileNav.onOpen}
      />

      <MobileNavContent isOpen={mobileNav.open} onClose={mobileNav.onClose} />
    </HStack>
  )
}

export default Navigation
