'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Textarea } from '@chakra-ui/react'
import { FileText, Loader2, Upload, X } from 'lucide-react'

import { useState } from 'react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { TicketFormData } from './types'

type TicketFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TicketFormData) => Promise<void>
  isSubmitting: boolean
}

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: 'bg-slate-500' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-500' },
  { value: 'HIGH', label: 'High', color: 'bg-amber-500' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-500' },
]

const CATEGORY_OPTIONS = [
  { value: 'ORDERS', label: 'Orders' },
  { value: 'PAYMENTS', label: 'Payments' },
  { value: 'DELIVERY', label: 'Delivery' },
  { value: 'RETURNS', label: 'Returns & Refunds' },
  { value: 'PRODUCTS', label: 'Products' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'OTHER', label: 'Other' },
]

export function TicketFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: TicketFormModalProps) {
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    category: 'OTHER',
    priority: 'MEDIUM',
    description: '',
    attachments: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    // Reset form after successful submission
    setFormData({
      subject: '',
      category: 'OTHER',
      priority: 'MEDIUM',
      description: '',
      attachments: [],
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-card/95 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Submit Support Ticket</h2>
              <p className="text-xs text-muted-foreground">
                We&#39;ll respond within 24 hours
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Brief description of your issue"
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide detailed information about your issue..."
              rows={6}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Attachments (Optional)
            </label>
            <div className="rounded-lg border-2 border-dashed border-border/60 bg-muted/20 p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, PDF up to 5MB
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorPalette="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </MotionBox>
    </div>
  )
}
