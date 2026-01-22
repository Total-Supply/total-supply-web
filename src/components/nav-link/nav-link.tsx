'use client'

import { Link as ChakraLink, type LinkProps } from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

import * as React from 'react'

type NavLinkProps = LinkProps & {
  href: string
  children: React.ReactNode
}

export function NavLink({ href, children, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <ChakraLink asChild {...props}>
      <NextLink href={href} aria-current={isActive ? 'page' : undefined}>
        {children}
      </NextLink>
    </ChakraLink>
  )
}
