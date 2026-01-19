'use client'

import { AdminTable, AdminTableShell } from '@/src/components/admin/admin-table'
import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Input } from '@/src/components/ui/input'
import { useToast } from '@/src/hooks/use-toast'
import { Textarea } from '@chakra-ui/react'
import { Dialog } from '@chakra-ui/react'

import { useEffect, useState } from 'react'

type ServiceOffering = {
  id: number
  name: string
  slug: string
  type: string
  category?: string | null
  description?: string | null
  basePrice?: number | null
  isActive: boolean
  createdAt: string
}

type ServiceOfferingFormState = {
  name: string
  slug: string
  type: string
  category: string
  description: string
  basePrice: string
  isActive: boolean
}

const emptyForm: ServiceOfferingFormState = {
  name: '',
  slug: '',
  type: 'CLEANING',
  category: '',
  description: '',
  basePrice: '',
  isActive: true,
}

const CATEGORY_OPTIONS = [
  'GENERAL_CLEANING',
  'DEEP_CLEAN',
  'OFFICE_CLEANING',
  'MOVE_OUT_CLEANING',
  'SANITIZATION',
  'OTHER',
]

export function AdminServiceOfferingsPage() {
  const toast = useToast()
  const [offerings, setOfferings] = useState<ServiceOffering[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editing, setEditing] = useState<ServiceOffering | null>(null)
  const [formState, setFormState] =
    useState<ServiceOfferingFormState>(emptyForm)

  useEffect(() => {
    const loadOfferings = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/services/offerings')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to load offerings')
        }
        setOfferings(data.data || [])
      } catch (error) {
        toast({
          title: 'Failed to load offerings',
          status: 'error',
          duration: 2500,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOfferings()
  }, [toast])

  const openCreate = () => {
    setFormState(emptyForm)
    setEditing(null)
    setIsDialogOpen(true)
  }

  const openEdit = (offering: ServiceOffering) => {
    setFormState({
      name: offering.name,
      slug: offering.slug,
      type: offering.type,
      category: offering.category || '',
      description: offering.description || '',
      basePrice: offering.basePrice ? String(offering.basePrice) : '',
      isActive: offering.isActive,
    })
    setEditing(offering)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formState.name.trim()) {
      toast({
        title: 'Name is required',
        status: 'warning',
        duration: 2500,
      })
      return
    }
    setIsSaving(true)
    try {
      const payload = {
        name: formState.name.trim(),
        slug: formState.slug.trim() || undefined,
        type: formState.type,
        category: formState.category || undefined,
        description: formState.description.trim() || undefined,
        basePrice: formState.basePrice
          ? Number(formState.basePrice)
          : undefined,
        isActive: formState.isActive,
      }
      const response = await fetch(
        editing
          ? `/api/admin/services/offerings/${editing.id}`
          : '/api/admin/services/offerings',
        {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Save failed')
      }
      toast({
        title: editing ? 'Offering updated' : 'Offering created',
        status: 'success',
        duration: 2000,
      })
      setIsDialogOpen(false)
      setEditing(null)
      setFormState(emptyForm)
      const refresh = await fetch('/api/admin/services/offerings')
      const refreshed = await refresh.json()
      if (refresh.ok) {
        setOfferings(refreshed.data || [])
      }
    } catch (error: unknown) {
      toast({
        title: 'Save failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (offering: ServiceOffering) => {
    const confirmed = window.confirm(
      `Delete ${offering.name}? This cannot be undone.`,
    )
    if (!confirmed) return
    try {
      const response = await fetch(
        `/api/admin/services/offerings/${offering.id}`,
        {
          method: 'DELETE',
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Delete failed')
      }
      toast({
        title: 'Offering deleted',
        status: 'success',
        duration: 2000,
      })
      setOfferings((prev) => prev.filter((entry) => entry.id !== offering.id))
    } catch (error: unknown) {
      toast({
        title: 'Delete failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    }
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <AdminTableShell
        title="Service offerings"
        description="Define service packages for the customer request form."
        actions={<Button onClick={openCreate}>Add offering</Button>}
      >
        <AdminTable>
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Offering</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Base price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  Loading offerings...
                </td>
              </tr>
            ) : offerings.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  No offerings found.
                </td>
              </tr>
            ) : (
              offerings.map((offering) => (
                <tr
                  key={offering.id}
                  className="border-t border-border/60 hover:bg-muted/30"
                >
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {offering.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {offering.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {offering.type.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {offering.category
                      ? offering.category.replace(/_/g, ' ')
                      : '—'}
                  </td>
                  <td className="px-4 py-4 text-right text-muted-foreground">
                    {offering.basePrice ? `LKR ${offering.basePrice}` : '—'}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        offering.isActive
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {offering.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(offering)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="solid"
                        onClick={() => handleDelete(offering)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </AdminTable>
      </AdminTableShell>

      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(details) => setIsDialogOpen(details.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxH="85vh" overflowY="auto">
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>
                {editing ? 'Edit offering' : 'Add service offering'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted-foreground">
                Offerings appear in the customer service request flow.
              </p>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Slug
                  </label>
                  <Input
                    value={formState.slug}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        slug: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Type
                    </label>
                    <AppSelect
                      value={formState.type}
                      options={[
                        { label: 'Cleaning', value: 'CLEANING' },
                        { label: 'IT Support', value: 'IT_SUPPORT' },
                      ]}
                      onChange={(value) =>
                        setFormState((prev) => ({
                          ...prev,
                          type: value,
                          category: value === 'IT_SUPPORT' ? '' : prev.category,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Category
                    </label>
                    <AppSelect
                      placeholder="No category"
                      value={formState.category}
                      options={[
                        { label: 'No category', value: '' },
                        ...CATEGORY_OPTIONS.map((option) => ({
                          label: option.replace(/_/g, ' '),
                          value: option,
                        })),
                      ]}
                      onChange={(value) =>
                        setFormState((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                      isDisabled={formState.type === 'IT_SUPPORT'}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <Textarea
                    value={formState.description}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Base price (LKR)
                    </label>
                    <Input
                      type="number"
                      value={formState.basePrice}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          basePrice: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <label className="flex items-center gap-2 pt-7 text-sm text-muted-foreground">
                    <Checkbox
                      checked={formState.isActive}
                      onCheckedChange={(checked) =>
                        setFormState((prev) => ({
                          ...prev,
                          isActive: Boolean(checked),
                        }))
                      }
                    />
                    Offering is active
                  </label>
                </div>
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </div>
  )
}
