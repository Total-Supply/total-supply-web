'use client'

import { AdminTableShell } from '@/src/components/admin/admin-table'
import { DeleteAlertDialog } from '@/src/components/admin/delete-alert-dialog'
import { ServiceOfferingDialog } from '@/src/components/admin/services/offerings/service-offering-dialog'
import { ServiceOfferingsTable } from '@/src/components/admin/services/offerings/service-offerings-table'
import { TableHeaderActions } from '@/src/components/admin/services/offerings/table-header-actions'
import { useToast } from '@/src/hooks/use-toast'

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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editing, setEditing] = useState<ServiceOffering | null>(null)
  const [formState, setFormState] =
    useState<ServiceOfferingFormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<ServiceOffering | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadOfferings = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
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
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    loadOfferings()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/services/offerings')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to refresh offerings')
      }
      setOfferings(data.data || [])
      toast({
        title: 'Offerings refreshed',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Failed to refresh',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

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

  const handleFormChange = (updates: Partial<ServiceOfferingFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }))
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
      await loadOfferings(false)
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

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const response = await fetch(
        `/api/admin/services/offerings/${deleteTarget.id}`,
        { method: 'DELETE' },
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
      setOfferings((prev) =>
        prev.filter((entry) => entry.id !== deleteTarget.id),
      )
      setDeleteTarget(null)
    } catch (error: unknown) {
      toast({
        title: 'Delete failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditing(null)
    setFormState(emptyForm)
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <AdminTableShell
        title="Service offerings"
        description="Define service packages for the customer request form."
        actions={
          <TableHeaderActions
            onRefresh={handleRefresh}
            onAdd={openCreate}
            isRefreshing={isRefreshing}
          />
        }
      >
        <ServiceOfferingsTable
          offerings={offerings}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      </AdminTableShell>

      <ServiceOfferingDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        formState={formState}
        onChange={handleFormChange}
        isEditing={!!editing}
        isSaving={isSaving}
        categoryOptions={CATEGORY_OPTIONS}
      />

      <DeleteAlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service Offering"
        description="Are you sure you want to delete this service offering?"
        itemName={deleteTarget?.name}
        isLoading={isDeleting}
      />
    </div>
  )
}
