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
    default: { py: 8, px: 4 },
    hero: { py: 16, px: 4, bg: 'gray.50' },
    feature: { py: 12, px: 4, bg: 'blue.50/20' },
  }

  return (
    <Box css={variantStyles[variant]} {...rest}>
      <Container height="full" maxW={innerWidth}>
        {children}
      </Container>
    </Box>
  )
}
