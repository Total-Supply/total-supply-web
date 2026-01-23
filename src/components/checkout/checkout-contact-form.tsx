'use client'

import { Input } from '@/src/components/ui/input'
import { Mail, Phone } from 'lucide-react'

type CheckoutContactFormProps = {
  email: string
  phone: string
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  errors: Record<string, string>
}

export function CheckoutContactForm({
  email,
  phone,
  onEmailChange,
  onPhoneChange,
  errors,
}: CheckoutContactFormProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
          <Mail className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p className="text-xs text-muted-foreground">How can we reach you?</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+94 77 123 4567"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  )
}
