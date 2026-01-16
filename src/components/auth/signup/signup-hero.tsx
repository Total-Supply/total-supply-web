'use client'

import { Features } from '@/src/components/features'
import { FallInPlace } from '@/src/components/motion/fall-in-place'
import siteConfig from '@/src/data/config'
import { Box } from '@chakra-ui/react'
import NextLink from 'next/link'

export function SignupHero() {
  return (
    <Box pe="20">
      <NextLink href="/">
        <FallInPlace>
          <Box as={siteConfig.logo} width="160px" ms="4" mb={{ base: 6, lg: 16 }} />
        </FallInPlace>
      </NextLink>
      <Features
        display={{ base: 'none', lg: 'flex' }}
        columns={1}
        iconSize={4}
        flex="1"
        py="0"
        ps="0"
        maxW={{ base: '100%', xl: '80%' }}
        features={siteConfig.signup.features.map((feature) => ({
          iconPosition: 'left',
          variant: 'left-icon',
          ...feature,
        }))}
      />
    </Box>
  )
}
