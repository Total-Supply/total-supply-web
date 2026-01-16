'use client'

import { ImageUploader } from '@/src/components/ImageUploader'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type ProfileData = {
  email: string
  name: string
  phone: string
  addressLine1: string
  city: string
  postalCode: string
  profileImage?: string | null
}

type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  error?: {
    message: string
  }
}

export function CustomerProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileData>({
    email: '',
    name: '',
    phone: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    profileImage: '',
  })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        const data = (await response.json()) as ApiResponse<ProfileData>
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to load profile')
        }
        setFormData((prev) => ({ ...prev, ...data.data }))
      } catch (err: any) {
        setError(err.message || 'Failed to load profile')
      }
    }

    loadProfile()
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage(null)
    setError(null)
    setIsSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          city: formData.city,
          postalCode: formData.postalCode,
          profileImage: formData.profileImage || undefined,
        }),
      })
      const data = (await response.json()) as ApiResponse<ProfileData>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Update failed')
      }
      setFormData((prev) => ({ ...prev, ...data.data }))
      setMessage(data.message || 'Profile updated')
    } catch (err: any) {
      setError(err.message || 'Update failed')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    setMessage(null)
    setError(null)
    try {
      const response = await fetch('/api/profile/export')
      const data = (await response.json()) as ApiResponse<unknown>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Export failed')
      }
      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'total-supply-profile.json'
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Export failed')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account?')) {
      return
    }
    setIsDeleting(true)
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'POST',
      })
      const data = (await response.json()) as ApiResponse<{ id: number }>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Delete failed')
      }
      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-xl shadow-slate-200/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <p className="text-sm text-slate-500">
              Update your details and keep your account current.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              Download data
            </Button>
            <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>
              Delete account
            </Button>
          </div>
        </div>

        {message && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-6 grid gap-6 md:grid-cols-2" onSubmit={handleSave}>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={formData.email} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+94771234567"
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label>Postal Code</Label>
            <Input
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal code"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Profile picture</Label>
            <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-white p-4">
              {formData.profileImage ? (
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200"
                  />
                  <span className="text-sm text-slate-500">
                    Upload a new image to replace your current photo.
                  </span>
                </div>
              ) : null}
              <ImageUploader
                onUploadComplete={(url) =>
                  setFormData((prev) => ({ ...prev, profileImage: url }))
                }
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
