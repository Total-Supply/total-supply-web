'use client'

import { useColorModeValue } from '@/src/hooks/color-mode'
import { Box, type BoxProps, useToken } from '@chakra-ui/react'

interface BackgroundGradientProps extends BoxProps {
  hideOverlay?: boolean
}

export function BackgroundGradient({
  hideOverlay,
  ...props
}: BackgroundGradientProps) {
  const [blue500, purple500] = useToken('colors', ['blue.500', 'purple.500'])

  const gradient = useColorModeValue(
    `radial-gradient(circle at top, ${blue500} 0%, transparent 60%)`,
    `radial-gradient(circle at top, ${purple500} 0%, transparent 60%)`,
  )

  if (hideOverlay) return <Box {...props} />

  return <Box {...props} bgImage={gradient} />
}
