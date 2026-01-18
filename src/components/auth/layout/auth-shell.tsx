'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Section } from '@/src/components/section'
import { useColorModeValue } from '@/src/hooks/color-mode'
import { Box, Grid, Stack, Text } from '@chakra-ui/react'

type AuthShellProps = {
  children: React.ReactNode
  heroTitle: string
  heroSubtitle: string
  heroTagline?: string
}

export function AuthShell({
  children,
  heroTitle,
  heroSubtitle,
  heroTagline,
}: AuthShellProps) {
  const panelBg = useColorModeValue(
    'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.82))',
    'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
  )
  const panelText = useColorModeValue('whiteAlpha.900', 'whiteAlpha.900')
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')
  const cardShadow = useColorModeValue(
    '0 24px 70px rgba(15, 23, 42, 0.25)',
    '0 28px 80px rgba(0, 0, 0, 0.45)',
  )

  return (
    <Section
      minH="100vh"
      innerWidth="container.xl"
      display="flex"
      alignItems={{ base: 'flex-start', lg: 'center' }}
      py={{ base: 6, md: 10 }}
    >
      <Grid
        templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }}
        gap={{ base: 6, lg: 10 }}
        alignItems="center"
        width="100%"
      >
        <Box
          position="relative"
          borderRadius={{ base: '2xl', lg: '3xl' }}
          overflow="hidden"
          minH={{ base: '200px', lg: '520px' }}
          bgImage={panelBg}
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 10 }}
          color={panelText}
        >
          <MotionBox
            position="absolute"
            inset="auto auto -60px -40px"
            w={{ base: '180px', md: '260px' }}
            h={{ base: '180px', md: '260px' }}
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(168, 85, 247, 0.4))"
            filter="blur(0px)"
            opacity={0.85}
            animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <MotionBox
            position="absolute"
            top="-60px"
            right="-40px"
            w={{ base: '160px', md: '240px' }}
            h={{ base: '160px', md: '240px' }}
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(14, 116, 144, 0.7), rgba(59, 130, 246, 0.35))"
            opacity={0.8}
            animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />

          <Stack position="relative" gap={4} maxW="sm">
            <Text fontSize={{ base: 'sm', md: 'md' }} letterSpacing="widest">
              TOTAL SUPPLY
            </Text>
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              {heroTitle}
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="whiteAlpha.800">
              {heroSubtitle}
            </Text>
            {heroTagline ? (
              <Text fontSize="xs" color="whiteAlpha.700">
                {heroTagline}
              </Text>
            ) : null}
          </Stack>
        </Box>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius={{ base: '2xl', lg: '3xl' }}
            boxShadow={cardShadow}
            p={{ base: 6, md: 8 }}
            backdropFilter="blur(18px)"
          >
            {children}
          </Box>
        </MotionBox>
      </Grid>
    </Section>
  )
}
