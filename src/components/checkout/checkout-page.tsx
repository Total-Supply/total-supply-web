'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'
import { RootState } from '@/src/store'
import { clearCart } from '@/src/store/slices/cartSlice'
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  ShoppingBag,
  Upload,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useMemo, useState } from 'react'

import { CheckoutAddressForm } from './checkout-address-form'
import { CheckoutContactForm } from './checkout-contact-form'
import { CheckoutNotesForm } from './checkout-notes-form'
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

export function CheckoutPageEnhanced() {
  const router = useRouter()
  const toast = useToast()
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.cart.items)
  const subtotal = useSelector((state: RootState) => state.cart.total)

  // Form States
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

  // Loading States
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Current Step (for visual progress)
  const [currentStep, setCurrentStep] = useState(1)

  const tax = 0
  const deliveryFee = subtotal > 5000 ? 0 : 250
  const total = subtotal + tax + deliveryFee

  // Load profile and addresses
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingProfile(true)
      try {
        const [profileRes, addressRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/addresses'),
        ])

        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setEmail(profileData.data?.email || '')
          setPhone(profileData.data?.phone || '')
          setStreet(profileData.data?.addressLine1 || '')
          setCity(profileData.data?.city || '')
          setPostalCode(profileData.data?.postalCode || '')
        }

        if (addressRes.ok) {
          const addressData = await addressRes.json()
          const mapped = (addressData.data || []).map(
            (address: AddressResponse) => ({
              id: String(address.id),
              label: address.label || address.line1,
              line1: address.line1,
              line2: address.line2,
              city: address.city,
              postalCode: address.postalCode,
              isDefault: address.isDefault,
            }),
          )
          setSavedAddresses(mapped)
          const defaultAddress = mapped.find(
            (addr: SavedAddress) => addr.isDefault,
          )
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id)
          }
        }
      } catch (error) {
        console.error('Failed to load data', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadData()
  }, [])

  // Auto-fill address when selected
  useEffect(() => {
    if (!selectedAddressId) return
    const match = savedAddresses.find((entry) => entry.id === selectedAddressId)
    if (!match) return
    setStreet(match.line1)
    setStreet2(match.line2 || '')
    setCity(match.city)
    setPostalCode(match.postalCode)
  }, [savedAddresses, selectedAddressId])

  // Cleanup photo preview
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    if (!email.trim()) nextErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Invalid email format'
    }

    if (!phone.trim()) nextErrors.phone = 'Phone number is required'
    else if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
      nextErrors.phone = 'Invalid phone number'
    }

    if (!street.trim()) nextErrors.street = 'Street address is required'
    if (!city.trim()) nextErrors.city = 'City is required'
    else if (!SERVICE_CITIES.includes(city)) {
      nextErrors.city = 'Delivery not available in this city'
    }

    if (!postalCode.trim()) nextErrors.postalCode = 'Postal code is required'
    else if (!/^\d{5}$/.test(postalCode)) {
      nextErrors.postalCode = 'Invalid postal code (5 digits)'
    }

    if (!termsAccepted) {
      nextErrors.terms = 'Please accept the terms to continue'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add items before placing an order',
        status: 'warning',
        duration: 2500,
      })
      return
    }

    if (isUploading) {
      toast({
        title: 'Upload in progress',
        description: 'Please wait for the image upload to finish',
        status: 'info',
        duration: 2500,
      })
      return
    }

    if (!validate()) {
      toast({
        title: 'Please review the form',
        description: 'Complete all required fields to continue',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setShowConfirmModal(true)
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

      setShowConfirmModal(false)
      dispatch(clearCart())

      toast({
        title: 'Order placed successfully!',
        description: 'We are preparing your delivery',
        status: 'success',
        duration: 3000,
      })

      router.push(`/checkout/success?orderNumber=${data.data.orderNumber}`)
    } catch (error: unknown) {
      let message = 'Please try again later'
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

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')

      const initResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: safeFilename,
          contentType: file.type,
          fileSize: file.size,
        }),
      })

      const initData = await initResponse.json()
      if (!initResponse.ok) {
        throw new Error(
          initData.error?.message || 'Upload initialization failed',
        )
      }

      const uploadResponse = await fetch(initData.data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error('Image upload failed')
      }

      setProofImageUrl(initData.data.publicUrl)
      setPhotoPreview(initData.data.publicUrl)

      toast({
        title: 'Image uploaded',
        description: 'Order photo uploaded successfully',
        status: 'success',
        duration: 2000,
      })
    } catch (error: unknown) {
      let message = 'Upload failed. Try again later'
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
  }

  const hasStockIssues = items.some(
    (item) =>
      (item.stock !== undefined && item.stock !== null && item.stock <= 0) ||
      (item.stock !== undefined &&
        item.stock !== null &&
        item.quantity > item.stock),
  )

  const steps = [
    { number: 1, title: 'Contact', icon: CreditCard },
    { number: 2, title: 'Delivery', icon: MapPin },
    { number: 3, title: 'Review', icon: ShoppingBag },
  ]

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your order securely
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      currentStep >= step.number
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background'
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all ${
                      currentStep > step.number ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </MotionBox>

        {/* Stock Issues Warning */}
        {hasStockIssues && (
          <MotionBox
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                    Stock Issues in Cart
                  </p>
                  <p className="text-sm text-red-700/90 dark:text-red-300/90 mt-1">
                    Some items are out of stock or exceed available quantity.
                    Please review your cart before checkout.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/cart')}
                    className="mt-3"
                  >
                    Review Cart
                  </Button>
                </div>
              </div>
            </div>
          </MotionBox>
        )}

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-16 text-center shadow-lg">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                <ShoppingBag className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Add items to your cart before proceeding to checkout
              </p>
              <Button
                size="lg"
                colorPalette="primary"
                onClick={() => router.push('/shop')}
              >
                Continue Shopping
              </Button>
            </div>
          </MotionBox>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              <CheckoutContactForm
                email={email}
                phone={phone}
                onEmailChange={setEmail}
                onPhoneChange={setPhone}
                errors={errors}
              />

              <CheckoutAddressForm
                street={street}
                street2={street2}
                city={city}
                postalCode={postalCode}
                saveDefault={saveDefault}
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                serviceCities={SERVICE_CITIES}
                onStreetChange={setStreet}
                onStreet2Change={setStreet2}
                onCityChange={setCity}
                onPostalCodeChange={setPostalCode}
                onSaveDefaultChange={setSaveDefault}
                onAddressSelect={setSelectedAddressId}
                errors={errors}
              />

              <CheckoutNotesForm
                notes={notes}
                termsAccepted={termsAccepted}
                photoPreview={photoPreview}
                isUploading={isUploading}
                onNotesChange={setNotes}
                onTermsChange={setTermsAccepted}
                onImageUpload={handleImageUpload}
                onRemoveImage={() => {
                  setPhotoPreview(null)
                  setProofImageUrl(null)
                }}
                errors={errors}
              />
            </div>

            {/* Right Column - Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <CheckoutOrderReview items={items} />
              <CheckoutSummary
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                total={total}
                itemCount={items.length}
                hasIssues={hasStockIssues}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Confirm Your Order</h3>
                <p className="text-sm text-muted-foreground">
                  Place order for LKR {total.toFixed(2)} to{' '}
                  {city || 'your address'}
                </p>
              </div>

              <div className="space-y-3 mb-6 rounded-lg border border-border/60 bg-muted/20 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery to</span>
                  <span className="font-medium">{city}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    LKR {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isPlacing}
                >
                  Cancel
                </Button>
                <Button
                  colorPalette="primary"
                  className="flex-1"
                  onClick={handleConfirmOrder}
                  disabled={isPlacing}
                >
                  {isPlacing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm Order
                    </>
                  )}
                </Button>
              </div>
            </MotionBox>
          </div>
        )}
      </div>
    </div>
  )
}
