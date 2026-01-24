'use client'

import { Box, SkipNavContent, SkipNavLink } from '@chakra-ui/react'

import type { ReactNode } from 'react'

import {
  AnnouncementBanner,
  type AnnouncementBannerProps,
} from '../announcement-banner'
import { Footer } from './footer'
import { HeaderEnhanced } from './header'

interface LayoutProps {
  children: ReactNode
  announcementProps?: AnnouncementBannerProps
}

export const MarketingLayout: React.FC<LayoutProps> = (props) => {
  const { children, announcementProps } = props

  return (
    <Box suppressHydrationWarning>
      <SkipNavLink>Skip to content</SkipNavLink>

      {announcementProps && <AnnouncementBanner {...announcementProps} />}

      <HeaderEnhanced />

      <Box as="main">
        <SkipNavContent />
        {children}
      </Box>

      <Footer />
    </Box>
  )
}
