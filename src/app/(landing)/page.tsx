'use client'

import { ButtonLink } from '@/src/components/button-link'
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
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { FiArrowRight, FiMonitor, FiPackage, FiTool } from 'react-icons/fi'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" overflow="hidden">
        <BackgroundGradient height="100%" zIndex="-1" />
        <Container maxW="container.xl" pt={{ base: 20, lg: 32 }} pb="20">
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
              <FallInPlace delay={0.4} fontWeight="medium">
                Order food, schedule cleaning services, and get IT support
                <br />
                all in one platform. Fast, reliable, and convenient.
              </FallInPlace>
            }
          >
            <FallInPlace delay={0.8}>
              <ButtonGroup spacing={4} alignItems="center" pt={8}>
                <Button
                  colorScheme="primary"
                  size="lg"
                  onClick={() => router.push('/shop')}
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  Order Now
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
      <Container maxW="container.xl" py={20}>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading size="xl">Our Services</Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            We provide comprehensive solutions for all your business and
            personal needs
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
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
      <Box bg="gray.50" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center" mb={12}>
            <Heading size="xl">Featured Products</Heading>
            <Text fontSize="lg" color="gray.600">
              Check out our most popular items
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
            {/* Featured products will be loaded from API */}
          </Grid>

          <Box textAlign="center" mt={8}>
            <Button
              colorScheme="primary"
              size="lg"
              onClick={() => router.push('/shop')}
              rightIcon={<Icon as={FiArrowRight} />}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="container.xl" py={20}>
        <Box
          bg="primary.500"
          color="white"
          borderRadius="2xl"
          p={12}
          textAlign="center"
        >
          <Heading size="xl" mb={4}>
            Ready to get started?
          </Heading>
          <Text fontSize="lg" mb={8}>
            Join thousands of satisfied customers today
          </Text>
          <ButtonGroup spacing={4}>
            <Button
              size="lg"
              bg="white"
              color="primary.500"
              _hover={{ bg: 'gray.100' }}
              onClick={() => router.push('/signup')}
            >
              Sign Up Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              color="white"
              borderColor="white"
              _hover={{ bg: 'whiteAlpha.200' }}
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
  icon: any
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
      p={8}
      bg="white"
      borderRadius="xl"
      borderWidth="1px"
      align="start"
      spacing={4}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
    >
      <Icon as={icon} boxSize={12} color="primary.500" />
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{description}</Text>
      <Button colorScheme="primary" onClick={onClick} width="full">
        {buttonText}
      </Button>
    </VStack>
  )
}

export default Home
