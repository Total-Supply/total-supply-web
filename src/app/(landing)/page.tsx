'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { Hero } from '@/src/components/hero'
import { FallInPlace } from '@/src/components/motion/fall-in-place'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import type { IconType } from 'react-icons'
import { FiArrowRight, FiMonitor, FiPackage, FiTool } from 'react-icons/fi'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" overflow="hidden">
        <BackgroundGradient height="100%" zIndex="-1" />
        <Container
          maxW="container.xl"
          pt={{ base: 20, lg: 32 }}
          pb={{ base: 16, lg: 20 }}
        >
          <Hero
            id="home"
            justifyContent="center"
            textAlign="center"
            title={
              <FallInPlace>
                Your Complete Supply <br /> Chain Solution
              </FallInPlace>
            }
            description={
              <FallInPlace delay={0.4}>
                <Text fontWeight="medium">
                  Order food, schedule cleaning services, and get IT support
                  <br />
                  all in one platform. Fast, reliable, and convenient.
                </Text>
              </FallInPlace>
            }
          >
            <FallInPlace delay={0.8}>
              <ButtonGroup gap={4} alignItems="center" pt={8}>
                <Button
                  colorPalette="primary"
                  size="lg"
                  onClick={() => router.push('/shop')}
                >
                  Order Now
                  <Icon as={FiArrowRight} ms="2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/services')}
                >
                  View Services
                </Button>
              </ButtonGroup>
            </FallInPlace>
          </Hero>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 20 }}>
        <VStack gap={4} textAlign="center" mb={{ base: 10, md: 12 }}>
          <Heading textStyle="sectionTitle">Our Services</Heading>
          <Text fontSize="lg" color="fg.muted" maxW="2xl">
            We provide comprehensive solutions for all your business and
            personal needs
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
          <ServiceCard
            icon={FiPackage}
            title="Food Supply"
            description="Fresh ingredients and quality food items delivered to your doorstep"
            onClick={() => router.push('/shop')}
            buttonText="Browse Menu"
          />

          <ServiceCard
            icon={FiTool}
            title="Cleaning Services"
            description="Professional cleaning services for homes and offices"
            onClick={() => router.push('/services?type=CLEANING')}
            buttonText="Book Cleaning"
          />

          <ServiceCard
            icon={FiMonitor}
            title="IT Support"
            description="Expert technical support and IT solutions for your business"
            onClick={() => router.push('/services?type=IT_SUPPORT')}
            buttonText="Get Support"
          />
        </SimpleGrid>
      </Container>

      {/* Featured Products Section */}
      <Box bg="bg.subtle" py={{ base: 16, md: 20 }}>
        <Container maxW="container.xl">
          <VStack gap={4} textAlign="center" mb={{ base: 10, md: 12 }}>
            <Heading textStyle="sectionTitle">Featured Products</Heading>
            <Text fontSize="lg" color="fg.muted">
              Check out our most popular items
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
            {/* Featured products will be loaded from API */}
          </Grid>

          <Box textAlign="center" mt={8}>
            <Button
              colorPalette="primary"
              size="lg"
              onClick={() => router.push('/shop')}
            >
              View All Products
              <Icon as={FiArrowRight} ms="2" />
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 20 }}>
        <Box
          bg="primary.600"
          color="white"
          borderRadius="2xl"
          p={{ base: 8, md: 12 }}
          textAlign="center"
        >
          <Heading textStyle="sectionTitle" mb={4}>
            Ready to get started?
          </Heading>
          <Text fontSize="lg" mb={8} color="whiteAlpha.900">
            Join thousands of satisfied customers today
          </Text>
          <ButtonGroup gap={4}>
            <Button
              size="lg"
              variant="solid"
              bg="white"
              color="primary.700"
              _hover={{ bg: 'whiteAlpha.900' }}
              onClick={() => router.push('/signup')}
            >
              Sign Up Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              color="white"
              borderColor="white"
              _hover={{ bg: 'whiteAlpha.200', borderColor: 'whiteAlpha.600' }}
              onClick={() => router.push('/login')}
            >
              Log In
            </Button>
          </ButtonGroup>
        </Box>
      </Container>
    </Box>
  )
}

interface ServiceCardProps {
  icon: IconType
  title: string
  description: string
  onClick: () => void
  buttonText: string
}

function ServiceCard({
  icon,
  title,
  description,
  onClick,
  buttonText,
}: ServiceCardProps) {
  return (
    <VStack
      p={{ base: 6, md: 8 }}
      layerStyle="card"
      align="start"
      gap={4}
      transitionProperty="common"
      transitionDuration="moderate"
      _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
    >
      <Icon as={icon} boxSize={12} color="primary.500" />
      <Heading size="md">{title}</Heading>
      <Text color="fg.muted">{description}</Text>
      <Button colorPalette="primary" onClick={onClick} width="full">
        {buttonText}
      </Button>
    </VStack>
  )
}

export default Home
