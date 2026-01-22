'use client'

import { useColorModeValue } from '@/src/hooks/color-mode'
import { Box, type BoxProps, Container, Flex } from '@chakra-ui/react'
import { useScroll } from 'framer-motion'

import * as React from 'react'

import { Logo } from './logo'
import Navigation from './navigation'

export type HeaderProps = Omit<BoxProps, 'children'>

export const Header = (props: HeaderProps) => {
  const ref = React.useRef<HTMLElement>(null)
  const [y, setY] = React.useState(0)
  const [height, setHeight] = React.useState(0)

  const { scrollY } = useScroll()

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height)
    }
  }, [])

  React.useEffect(() => {
    return scrollY.on('change', () => setY(scrollY.get()))
  }, [scrollY])

  const bg = useColorModeValue('whiteAlpha.700', 'rgba(29, 32, 37, 0.7)')

  return (
    <Box
      ref={ref}
      as="header"
      top="0"
      w="full"
      position="fixed"
      backdropFilter="blur(5px)"
      zIndex="sticky"
      borderColor="whiteAlpha.100"
      transitionProperty="common"
      transitionDuration="normal"
      bg={y > height ? bg : undefined}
      boxShadow={y > height ? 'md' : undefined}
      borderBottomWidth={y > height ? '1px' : undefined}
      {...props}
    >
      <Container
        maxW="container.2xl"
        px={{ base: 4, md: 8 }}
        py={{ base: 3, md: 4 }}
      >
        <Flex width="full" align="center" justify="space-between">
          <Logo
            onClick={(e) => {
              if (
                typeof window !== 'undefined' &&
                window.location.pathname === '/'
              ) {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          />
          <Navigation />
        </Flex>
      </Container>
    </Box>
  )
}
