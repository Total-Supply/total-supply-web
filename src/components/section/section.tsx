'use client'

import { Box, Container, HTMLChakraProps } from '@chakra-ui/react'

export interface SectionProps extends HTMLChakraProps<'div'> {
  children: React.ReactNode
  innerWidth?: string
  variant?: 'default' | 'hero' | 'feature'
}

export const Section: React.FC<SectionProps> = (props) => {
  const {
    children,
    innerWidth = 'container.lg',
    variant = 'default',
    ...rest
  } = props

  const variantStyles = {
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
    <Box css={variantStyles[variant]} {...rest}>
      <Container height="full" maxW={innerWidth}>
        {children}
      </Container>
    </Box>
  )
}
