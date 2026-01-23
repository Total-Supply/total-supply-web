'use client'

import { Box, SkipNavContent, SkipNavLink } from '@chakra-ui/react'

import type { ReactNode } from 'react'

import {
  AnnouncementBanner,
  type AnnouncementBannerProps,
} from '../announcement-banner'
import { Footer, type FooterProps } from './footer'
import { Header, type HeaderProps } from './header'

interface LayoutProps {
  children: ReactNode
  announcementProps?: AnnouncementBannerProps
  headerProps?: HeaderProps
  footerProps?: FooterProps
}

export const MarketingLayout: React.FC<LayoutProps> = (props) => {
  const { children, announcementProps, headerProps, footerProps } = props

  return (
    <Box suppressHydrationWarning>
      <SkipNavLink>Skip to content</SkipNavLink>

      {announcementProps && <AnnouncementBanner {...announcementProps} />}

      <Header {...(headerProps ?? {})} />

      <Box as="main">
        <SkipNavContent />
        {children}
      </Box>

      <Footer {...(footerProps ?? {})} />
    </Box>
  )
}
