'use client'

import { Box, Container, type HTMLChakraProps } from '@chakra-ui/react'

import * as React from 'react'

export interface SectionProps extends HTMLChakraProps<'section'> {
  children: React.ReactNode
  /**
   * Chakra Container maxW supports tokens like "container.lg"
   * and also numeric values (e.g. 1200).
   */
  innerWidth?: string | number
  variant?: 'default' | 'hero' | 'feature'
}

export const Section: React.FC<SectionProps> = (props) => {
  const {
    children,
    innerWidth = 'container.lg',
    variant = 'default',
    ...rest
  } = props

  const variantStyles: Record<NonNullable<SectionProps['variant']>, HTMLChakraProps<'section'>> = {
    default: { py: { base: 10, md: 14 }, px: { base: 4, md: 6 } },
    hero: {
      py: { base: 16, md: 24 },
      px: { base: 4, md: 6 },
      bg: 'bg.subtle',
    },
    feature: {
      py: { base: 12, md: 18 },
      px: { base: 4, md: 6 },
      bg: 'bg.muted',
    },
  }

  return (
    <Box as="section" css={variantStyles[variant]} {...rest}>
      <Container height="full" maxW={innerWidth}>
        {children}
      </Container>
    </Box>
  )
}
