'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { AppSelect } from '@/src/components/ui/app-select'
import { useColorModeValue } from '@/src/hooks/color-mode'
import { useToast } from '@/src/hooks/use-toast'
import { RootState } from '@/src/store'
import { clearCart } from '@/src/store/slices/cartSlice'
import {
  Box,
  Container,
  Dialog,
  Field,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { CheckoutOrderReview } from './checkout-order-review'
import { CheckoutSummary } from './checkout-summary'

type SavedAddress = {
  id: string
  label: string
  line1: string
  line2?: string | null
  city: string
  postalCode: string
  isDefault?: boolean
}

type AddressResponse = {
  id: number
  label?: string | null
  line1: string
  line2?: string | null
  city: string
  postalCode: string
  isDefault?: boolean
}

const SERVICE_CITIES = [
  'Colombo',
  'Kandy',
  'Galle',
  'Jaffna',
  'Negombo',
  'Kurunegala',
]

export function CheckoutPage() {
  const router = useRouter()
  const toast = useToast()
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.cart.items)
  const subtotal = useSelector((state: RootState) => state.cart.total)
  const confirmModal = useDisclosure()
  const modalBg = useColorModeValue('white', 'gray.900')

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [street2, setStreet2] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [saveDefault, setSaveDefault] = useState(false)
  const [notes, setNotes] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [proofImageUrl, setProofImageUrl] = useState<string | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)

  const tax = 0
  const deliveryFee = subtotal > 0 ? 0 : 0
  const total = subtotal + tax + deliveryFee

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()
        if (!response.ok) return
        setEmail(data.data?.email || '')
        setPhone(data.data?.phone || '')
        setStreet(data.data?.addressLine1 || '')
        setCity(data.data?.city || '')
        setPostalCode(data.data?.postalCode || '')
      } catch (error) {
        console.error('Failed to load profile', error)
      }
    }

    const loadAddresses = async () => {
      try {
        const response = await fetch('/api/addresses')
        const data = await response.json()
        if (!response.ok) return
        const mapped = (data.data || []).map((address: AddressResponse) => ({
          id: String(address.id),
          label: address.label || address.line1,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          postalCode: address.postalCode,
          isDefault: address.isDefault,
        }))
        setSavedAddresses(mapped)
        const defaultAddress = mapped.find(
          (address: SavedAddress) => address.isDefault,
        )
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        }
      } catch (error) {
        console.error('Failed to load addresses', error)
      }
    }

    loadProfile()
    loadAddresses()
  }, [])

  useEffect(() => {
    if (!selectedAddressId) return
    const match = savedAddresses.find((entry) => entry.id === selectedAddressId)
    if (!match) return
    setStreet(match.line1)
    setStreet2(match.line2 || '')
    setCity(match.city)
    setPostalCode(match.postalCode)
  }, [savedAddresses, selectedAddressId])

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id)
    const match = savedAddresses.find((entry) => entry.id === id)
    if (!match) return
    setStreet(match.line1)
    setStreet2(match.line2 || '')
    setCity(match.city)
    setPostalCode(match.postalCode)
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!email.trim()) nextErrors.email = 'Email is required.'
    if (!phone.trim()) nextErrors.phone = 'Phone number is required.'
    if (!street.trim()) nextErrors.street = 'Street address is required.'
    if (!city.trim()) nextErrors.city = 'City is required.'
    if (!postalCode.trim()) nextErrors.postalCode = 'Postal code is required.'
    if (city && !SERVICE_CITIES.includes(city)) {
      nextErrors.city = 'Delivery not available in this city.'
    }
    if (!termsAccepted) {
      nextErrors.terms = 'Please accept the terms to continue.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add items before placing an order.',
        status: 'warning',
        duration: 2500,
      })
      return
    }
    if (isUploading) {
      toast({
        title: 'Upload in progress',
        description: 'Please wait for the image upload to finish.',
        status: 'info',
        duration: 2500,
      })
      return
    }
    if (!validate()) {
      toast({
        title: 'Please review the form',
        description: 'Complete required fields to continue.',
        status: 'error',
        duration: 2500,
      })
      return
    }
    confirmModal.onOpen()
  }

  const handleConfirmOrder = async () => {
    setIsPlacing(true)
    try {
      const selectedMatch = savedAddresses.find(
        (address) => address.id === selectedAddressId,
      )
      const matchesSelected =
        selectedMatch &&
        selectedMatch.line1 === street &&
        (selectedMatch.line2 || '') === street2 &&
        selectedMatch.city === city &&
        selectedMatch.postalCode === postalCode

      const deliveryAddressId = matchesSelected
        ? Number(selectedAddressId)
        : undefined

      const payload = {
        items: items.map((item) => ({
          foodItemId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddressId,
        deliveryAddress: deliveryAddressId
          ? undefined
          : {
              line1: street,
              line2: street2 || undefined,
              city,
              postalCode,
              country: 'Sri Lanka',
            },
        saveAsDefault: saveDefault,
        notes: notes || undefined,
        proofImageUrl: proofImageUrl || undefined,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Unable to place order')
      }
      confirmModal.onClose()
      dispatch(clearCart())
      toast({
        title: 'Order placed',
        description: 'We are preparing your delivery.',
        status: 'success',
        duration: 3000,
      })
      router.push(`/checkout/success?orderNumber=${data.data.orderNumber}`)
    } catch (error: unknown) {
      let message = 'Please try again.'
      if (error instanceof Error) {
        message = error.message
      }
      toast({
        title: 'Order failed',
        description: message,
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsPlacing(false)
    }
  }

  const selectedAddress = useMemo(
    () => savedAddresses.find((entry) => entry.id === selectedAddressId),
    [savedAddresses, selectedAddressId],
  )

  return (
    <Stack gap={10}>
      <BackgroundGradient height="260px" />
      <Container
        maxW="container.xl"
        pt={{ base: 8, md: 12 }}
        pb={{ base: 20, md: 16 }}
      >
        <Stack gap={3}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              Checkout
            </Text>
          </MotionBox>
          <Text color="muted" fontSize={{ base: 'sm', md: 'md' }}>
            Confirm delivery details and place your order.
          </Text>
        </Stack>

        {items.length === 0 ? (
          <Stack
            mt={10}
            gap={3}
            align="center"
            borderRadius="2xl"
            borderWidth="1px"
            borderStyle="dashed"
            py={16}
          >
            <Text fontSize="lg" fontWeight="600">
              Your cart is empty
            </Text>
            <Text color="muted" fontSize="sm">
              Add items before checking out.
            </Text>
            <Button colorScheme="primary" onClick={() => router.push('/shop')}>
              Continue shopping
            </Button>
          </Stack>
        ) : (
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            gap={{ base: 8, lg: 10 }}
            mt={10}
          >
            <Stack gap={6}>
              <Box borderWidth="1px" borderRadius="2xl" p={6}>
                <Stack gap={4}>
                  <Text fontSize="lg" fontWeight="600">
                    Contact details
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Field.Root invalid={!!errors.email}>
                      <Field.Label>Email</Field.Label>
                      <Input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@email.com"
                      />
                      <Field.ErrorText>{errors.email}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.phone}>
                      <Field.Label>Phone</Field.Label>
                      <Input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="+94 77 123 4567"
                      />
                      <Field.ErrorText>{errors.phone}</Field.ErrorText>
                    </Field.Root>
                  </SimpleGrid>
                </Stack>
              </Box>

              <Box borderWidth="1px" borderRadius="2xl" p={6}>
                <Stack gap={4}>
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="600">
                      Delivery address
                    </Text>
                    {savedAddresses.length > 0 && (
                      <Box maxW="200px">
                        <AppSelect
                          placeholder="Select saved"
                          value={selectedAddressId}
                          onChange={(value) => handleAddressSelect(value)}
                          options={savedAddresses.map((address) => ({
                            label: address.label,
                            value: address.id,
                          }))}
                        />
                      </Box>
                    )}
                  </HStack>
                  {savedAddresses.length === 0 && (
                    <Text fontSize="sm" color="muted">
                      No saved addresses yet.
                    </Text>
                  )}
                  {selectedAddress ? (
                    <Text fontSize="sm" color="muted">
                      Using {selectedAddress.label}
                    </Text>
                  ) : null}
                  <Field.Root invalid={!!errors.street}>
                    <Field.Label>Street address</Field.Label>
                    <Input
                      value={street}
                      onChange={(event) => setStreet(event.target.value)}
                      placeholder="Street name and number"
                    />
                    <Field.ErrorText>{errors.street}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Apartment or suite</Field.Label>
                    <Input
                      value={street2}
                      onChange={(event) => setStreet2(event.target.value)}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </Field.Root>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Field.Root invalid={!!errors.city}>
                      <Field.Label>City</Field.Label>
                      <AppSelect
                        placeholder="Select city"
                        value={city}
                        onChange={(value) => setCity(value)}
                        options={SERVICE_CITIES.map((serviceCity) => ({
                          label: serviceCity,
                          value: serviceCity,
                        }))}
                      />
                      <Field.ErrorText>{errors.city}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.postalCode}>
                      <Field.Label>Postal code</Field.Label>
                      <Input
                        value={postalCode}
                        onChange={(event) => setPostalCode(event.target.value)}
                        placeholder="00000"
                      />
                      <Field.ErrorText>{errors.postalCode}</Field.ErrorText>
                    </Field.Root>
                  </SimpleGrid>
                  <Checkbox
                    isChecked={saveDefault}
                    onChange={(event) => setSaveDefault(event.target.checked)}
                  >
                    Save as default address
                  </Checkbox>
                </Stack>
              </Box>

              <Box borderWidth="1px" borderRadius="2xl" p={6}>
                <Stack gap={4}>
                  <Text fontSize="lg" fontWeight="600">
                    Order notes
                  </Text>
                  <Field.Root>
                    <Field.Label>Upload order photo (optional)</Field.Label>
                    <Input
                      type="file"
                      accept="image/*"
                      isDisabled={isUploading}
                      onChange={async (event) => {
                        const file = event.target.files?.[0]
                        if (!file) return
                        setIsUploading(true)
                        try {
                          const safeFilename = file.name.replace(
                            /[^a-zA-Z0-9._-]/g,
                            '_',
                          )
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              filename: safeFilename,
                              contentType: file.type,
                              fileSize: file.size,
                            }),
                          })
                          const data = await response.json()
                          if (!response.ok) {
                            throw new Error(
                              data.error?.message ||
                                'Upload initialization failed',
                            )
                          }

                          const uploadResponse = await fetch(
                            data.data.uploadUrl,
                            {
                              method: 'PUT',
                              headers: {
                                'Content-Type': file.type,
                              },
                              body: file,
                            },
                          )

                          if (!uploadResponse.ok) {
                            throw new Error('Image upload failed')
                          }

                          setProofImageUrl(data.data.publicUrl)
                          setPhotoPreview(data.data.publicUrl)
                        } catch (error: unknown) {
                          let message = 'Try again later.'
                          if (error instanceof Error) {
                            message = error.message
                          }
                          toast({
                            title: 'Upload failed',
                            description: message,
                            status: 'error',
                            duration: 2500,
                          })
                        } finally {
                          setIsUploading(false)
                        }
                      }}
                    />
                    {isUploading && (
                      <Text fontSize="xs" color="muted" mt={2}>
                        Uploading image...
                      </Text>
                    )}
                    {photoPreview && (
                      <Image
                        src={photoPreview}
                        alt="Order preview"
                        borderRadius="xl"
                        maxH="180px"
                        objectFit="cover"
                        mt={3}
                      />
                    )}
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Notes</Field.Label>
                    <Textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Add delivery instructions or substitutions"
                      rows={4}
                    />
                  </Field.Root>
                  <Field.Root invalid={!!errors.terms}>
                    <Checkbox
                      isChecked={termsAccepted}
                      onChange={(event) =>
                        setTermsAccepted(event.target.checked)
                      }
                    >
                      I agree to terms
                    </Checkbox>
                    <Field.ErrorText>{errors.terms}</Field.ErrorText>
                  </Field.Root>
                </Stack>
              </Box>
            </Stack>

            <Stack gap={6}>
              <CheckoutOrderReview
                items={items.map((item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image,
                }))}
              />
              <CheckoutSummary
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                total={total}
                onPlaceOrder={handlePlaceOrder}
              />
            </Stack>
          </SimpleGrid>
        )}
      </Container>

      <Dialog.Root
        open={confirmModal.open}
        onOpenChange={(details) => {
          if (!details.open) {
            confirmModal.onClose()
          }
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl" bg={modalBg}>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Confirm your order</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" color="muted">
                Place order for LKR {total.toFixed(2)} to{' '}
                {city || 'your address'}.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={3} w="full">
                <Button
                  variant="outline"
                  flex="1"
                  onClick={confirmModal.onClose}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="primary"
                  flex="1"
                  onClick={handleConfirmOrder}
                  loading={isPlacing}
                >
                  Confirm
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  )
}
