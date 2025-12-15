'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Heading,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiCalendar, FiCheck, FiMapPin, FiTool } from 'react-icons/fi'

import { Suspense, useState } from 'react'

const Services: NextPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const defaultType = searchParams.get('type') || 'CLEANING'

  const [selectedTab, setSelectedTab] = useState(
    defaultType === 'IT_SUPPORT' ? 1 : 0,
  )
  const [formData, setFormData] = useState({
    type: defaultType,
    title: '',
    description: '',
    addressId: '',
    requestedDate: '',
    priority: 'MEDIUM',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Check authentication
    // if (!isAuthenticated) {
    //   router.push('/login?redirect=/services')
    //   return
    // }

    try {
      // TODO: Implement API call
      // await apiClient.services.create(formData)

      toast({
        title: 'Service request submitted',
        description: 'We will contact you shortly to confirm the booking.',
        status: 'success',
        duration: 5000,
      })

      // Reset form
      setFormData({
        ...formData,
        title: '',
        description: '',
        requestedDate: '',
      })
    } catch (error) {
      toast({
        title: 'Request failed',
        description: 'Please try again or contact support.',
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Box>
      <BackgroundGradient height="300px" />

      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading size="2xl">Our Services</Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Professional services tailored to your needs
          </Text>
        </VStack>

        <Tabs
          index={selectedTab}
          onChange={(index) => {
            setSelectedTab(index)
            setFormData({
              ...formData,
              type: index === 0 ? 'CLEANING' : 'IT_SUPPORT',
            })
          }}
          variant="enclosed"
          colorScheme="primary"
        >
          <TabList>
            <Tab>Cleaning Services</Tab>
            <Tab>IT Support</Tab>
          </TabList>

          <TabPanels>
            {/* Cleaning Services */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                <VStack align="stretch" spacing={6}>
                  <Box>
                    <Heading size="lg" mb={4}>
                      Professional Cleaning Services
                    </Heading>
                    <Text color="gray.600" mb={6}>
                      We provide top-quality cleaning services for homes and
                      offices
                    </Text>
                  </Box>

                  <ServiceFeatures
                    features={[
                      'Residential cleaning',
                      'Office cleaning',
                      'Deep cleaning',
                      'Regular maintenance',
                      'Eco-friendly products',
                      'Trained professionals',
                    ]}
                  />

                  <ServicePricing
                    packages={[
                      {
                        name: 'Basic',
                        price: 'LKR 5,000',
                        features: ['2 rooms', '2 hours'],
                      },
                      {
                        name: 'Standard',
                        price: 'LKR 8,000',
                        features: ['4 rooms', '4 hours'],
                      },
                      {
                        name: 'Premium',
                        price: 'LKR 12,000',
                        features: ['Whole house', '6 hours'],
                      },
                    ]}
                  />
                </VStack>

                <ServiceRequestForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                />
              </Grid>
            </TabPanel>

            {/* IT Support */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                <VStack align="stretch" spacing={6}>
                  <Box>
                    <Heading size="lg" mb={4}>
                      IT Support & Solutions
                    </Heading>
                    <Text color="gray.600" mb={6}>
                      Expert technical support for your business needs
                    </Text>
                  </Box>

                  <ServiceFeatures
                    features={[
                      'Network setup',
                      'Hardware repair',
                      'Software installation',
                      'Data recovery',
                      'Remote support',
                      '24/7 availability',
                    ]}
                  />

                  <ServicePricing
                    packages={[
                      {
                        name: 'Basic',
                        price: 'LKR 3,000',
                        features: ['Single device', '1 hour'],
                      },
                      {
                        name: 'Business',
                        price: 'LKR 10,000',
                        features: ['Multiple devices', '4 hours'],
                      },
                      {
                        name: 'Enterprise',
                        price: 'Custom',
                        features: ['Full support', 'Ongoing'],
                      },
                    ]}
                  />
                </VStack>

                <ServiceRequestForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                />
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  )
}

function ServiceFeatures({ features }: { features: string[] }) {
  return (
    <Box>
      <Heading size="md" mb={4}>
        What's Included
      </Heading>
      <SimpleGrid columns={2} spacing={3}>
        {features.map((feature, i) => (
          <HStack key={i}>
            <Icon as={FiCheck} color="green.500" />
            <Text fontSize="sm">{feature}</Text>
          </HStack>
        ))}
      </SimpleGrid>
    </Box>
  )
}

function ServicePricing({ packages }: { packages: any[] }) {
  return (
    <Box>
      <Heading size="md" mb={4}>
        Pricing Packages
      </Heading>
      <SimpleGrid columns={3} spacing={4}>
        {packages.map((pkg, i) => (
          <VStack
            key={i}
            p={4}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            align="stretch"
          >
            <Text fontWeight="bold">{pkg.name}</Text>
            <Text fontSize="xl" color="primary.500" fontWeight="bold">
              {pkg.price}
            </Text>
            {pkg.features.map((f: string, j: number) => (
              <Text key={j} fontSize="sm" color="gray.600">
                • {f}
              </Text>
            ))}
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  )
}

function ServiceRequestForm({ formData, setFormData, onSubmit }: any) {
  return (
    <Box
      bg="white"
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      as="form"
      onSubmit={onSubmit}
    >
      <Heading size="md" mb={6}>
        Request Service
      </Heading>

      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Service Title</FormLabel>
          <Input
            placeholder="e.g., Office Deep Cleaning"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Describe your requirements..."
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Preferred Date & Time</FormLabel>
          <Input
            type="datetime-local"
            value={formData.requestedDate}
            onChange={(e) =>
              setFormData({ ...formData, requestedDate: e.target.value })
            }
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Priority</FormLabel>
          <Select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="primary" size="lg" w="full">
          Submit Request
        </Button>

        <Text fontSize="xs" color="gray.500" textAlign="center">
          You need to be logged in to request services
        </Text>
      </VStack>
    </Box>
  )
}

function ServicesContent() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Services</h1>
      <p>Browse our services</p>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ServicesContent />
    </Suspense>
  )
}
