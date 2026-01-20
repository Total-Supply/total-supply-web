'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Dialog } from '@chakra-ui/react'
import { Edit, X } from 'lucide-react'

type AdminUser = {
  id: number
  email: string
  name: string
  role: string
  status: string
  createdAt: string
}

type EditUserDialogProps = {
  user: AdminUser | null
  formData: {
    name: string
    email: string
    role: string
  }
  onFormChange: (field: string, value: string) => void
  onConfirm: () => void
  onCancel: () => void
  isSaving: boolean
  roleOptions: string[]
}

export function EditUserDialog({
  user,
  formData,
  onFormChange,
  onConfirm,
  onCancel,
  isSaving,
  roleOptions,
}: EditUserDialogProps) {
  return (
    <Dialog.Root
      open={!!user}
      onOpenChange={(details) => !details.open && onCancel()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
                <Edit className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Edit User
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Update user information
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Enter user name"
                  value={formData.name}
                  onChange={(event) => onFormChange('name', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(event) =>
                    onFormChange('email', event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Role <span className="text-destructive">*</span>
                </label>
                <AppSelect
                  value={formData.role}
                  onChange={(value) => onFormChange('role', value)}
                  options={roleOptions.map((role) => ({
                    label: role.replace(/_/g, ' '),
                    value: role,
                  }))}
                />
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="blue"
              onClick={onConfirm}
              disabled={!formData.name || !formData.email || isSaving}
              loading={isSaving}
            >
              Save Changes
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
