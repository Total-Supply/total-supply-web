'use client'

import { ImageUploader } from '@/src/components/ImageUploader'
import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import {
  Building2,
  Code,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'

type ProfileData = {
  email: string
  name: string
  phone: string
  addressLine1: string
  city: string
  postalCode: string
  profileImage?: string | null
}

type ProfileFormProps = {
  formData: ProfileData
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onImageUpload: (url: string) => void
  onSubmit: (event: React.FormEvent) => void
  isSaving: boolean
}

export function ProfileForm({
  formData,
  onChange,
  onImageUpload,
  onSubmit,
  isSaving,
}: ProfileFormProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold">My Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your details and keep your account current.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </label>
            <Input
              value={formData.email || ''}
              readOnly
              disabled
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              name="name"
              value={formData.name || ''}
              onChange={onChange}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone
            </label>
            <Input
              name="phone"
              value={formData.phone || ''}
              onChange={onChange}
              placeholder="+94 77 123 4567"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Address
            </label>
            <Input
              name="addressLine1"
              value={formData.addressLine1 || ''}
              onChange={onChange}
              placeholder="Street address"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              City
            </label>
            <Input
              name="city"
              value={formData.city || ''}
              onChange={onChange}
              placeholder="City"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              Postal Code
            </label>
            <Input
              name="postalCode"
              value={formData.postalCode || ''}
              onChange={onChange}
              placeholder="Postal code"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            Profile Picture
          </label>
          <div className="rounded-xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
            {formData.profileImage && (
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <p className="text-sm font-medium">Current Profile Picture</p>
                  <p className="text-xs text-muted-foreground">
                    Upload a new image to replace
                  </p>
                </div>
              </div>
            )}
            <ImageUploader onUploadComplete={onImageUpload} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={isSaving} className="min-w-[120px]">
            Save Changes
          </Button>
        </div>
      </form>
    </MotionBox>
  )
}
