'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog } from '@chakra-ui/react'
import { FileText, X } from 'lucide-react'

import { useState } from 'react'

type TicketFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TicketFormData) => void
  isSubmitting: boolean
}

export type TicketFormData = {
  subject: string
  category: string
  priority: string
  description: string
}

const categories = [
  'Orders',
  'Payments',
  'Shipping',
  'Account',
  'Technical',
  'Other',
]
const priorities = ['Low', 'Medium', 'High', 'Urgent']

export function TicketForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: TicketFormProps) {
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    category: 'Orders',
    priority: 'Medium',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 max-w-2xl">
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/30">
                <FileText className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Create Support Ticket
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Provide details about your issue
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Subject <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <AppSelect
                    value={formData.category}
                    onChange={(value) => handleChange('category', value)}
                    options={categories.map((cat) => ({
                      label: cat,
                      value: cat,
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Priority <span className="text-destructive">*</span>
                  </label>
                  <AppSelect
                    value={formData.priority}
                    onChange={(value) => handleChange('priority', value)}
                    options={priorities.map((pri) => ({
                      label: pri,
                      value: pri,
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Provide detailed information about your issue..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={6}
                  required
                />
              </div>
            </form>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="blue"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!formData.subject || !formData.description}
            >
              Submit Ticket
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
