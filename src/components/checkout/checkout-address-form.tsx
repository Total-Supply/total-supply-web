'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Input } from '@/src/components/ui/input'
import { Home, MapPin } from 'lucide-react'

type SavedAddress = {
  id: string
  label: string
  line1: string
  line2?: string | null
  city: string
  postalCode: string
  isDefault?: boolean
}

type CheckoutAddressFormProps = {
  street: string
  street2: string
  city: string
  postalCode: string
  saveDefault: boolean
  savedAddresses: SavedAddress[]
  selectedAddressId: string
  serviceCities: string[]
  onStreetChange: (value: string) => void
  onStreet2Change: (value: string) => void
  onCityChange: (value: string) => void
  onPostalCodeChange: (value: string) => void
  onSaveDefaultChange: (value: boolean) => void
  onAddressSelect: (id: string) => void
  errors: Record<string, string>
}

export function CheckoutAddressForm({
  street,
  street2,
  city,
  postalCode,
  saveDefault,
  savedAddresses,
  selectedAddressId,
  serviceCities,
  onStreetChange,
  onStreet2Change,
  onCityChange,
  onPostalCodeChange,
  onSaveDefaultChange,
  onAddressSelect,
  errors,
}: CheckoutAddressFormProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <MapPin className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Delivery Address</h3>
            <p className="text-xs text-muted-foreground">
              Where should we deliver?
            </p>
          </div>
        </div>

        {savedAddresses.length > 0 && (
          <div className="w-48">
            <AppSelect
              placeholder="Use saved address"
              value={selectedAddressId}
              onChange={onAddressSelect}
              options={savedAddresses.map((address) => ({
                label: address.label,
                value: address.id,
              }))}
            />
          </div>
        )}
      </div>

      {savedAddresses.length === 0 && (
        <div className="mb-4 rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No saved addresses. Fill in your delivery details below.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Street Address</label>
          <Input
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder="123 Main Street"
            className={errors.street ? 'border-red-500' : ''}
          />
          {errors.street && (
            <p className="text-xs text-red-500">{errors.street}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Apartment, Suite, etc. (Optional)
          </label>
          <Input
            value={street2}
            onChange={(e) => onStreet2Change(e.target.value)}
            placeholder="Apt 4B, Building 2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <AppSelect
              placeholder="Select city"
              value={city}
              onChange={onCityChange}
              options={serviceCities.map((serviceCity) => ({
                label: serviceCity,
                value: serviceCity,
              }))}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Postal Code</label>
            <Input
              value={postalCode}
              onChange={(e) => onPostalCodeChange(e.target.value)}
              placeholder="10400"
              maxLength={5}
              className={errors.postalCode ? 'border-red-500' : ''}
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500">{errors.postalCode}</p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Checkbox checked={saveDefault} onCheckedChange={onSaveDefaultChange}>
            <span className="text-sm">Save as default delivery address</span>
          </Checkbox>
        </div>
      </div>
    </div>
  )
}
