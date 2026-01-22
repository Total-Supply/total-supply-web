'use client'

import { AdminTableShell } from '@/src/components/admin/admin-table'
import { DeleteAlertDialog } from '@/src/components/admin/delete-alert-dialog'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'

import { useEffect, useState } from 'react'

import { CategoriesTable } from './categories-table'
import { CategoryDialog } from './category-dialog'
import { CategoryHeaderActions } from './category-header-actions'

type CatalogCategory = {
  id: number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  itemCount?: number
}

type PaginatedResponse<T> = {
  data: T[]
  meta?: {
    page: number
    totalPages: number
  }
}

type CategoryFormState = {
  name: string
  slug: string
  description: string
  imageUrl: string
}

const emptyForm: CategoryFormState = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
}

export function AdminCatalogCategoriesPage() {
  const toast = useToast()
  const [categories, setCategories] = useState<CatalogCategory[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [formState, setFormState] = useState<CategoryFormState>(emptyForm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<CatalogCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CatalogCategory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadCategories = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      })
      if (search) params.set('search', search)

      const response = await fetch(
        `/api/admin/catalog/categories?${params.toString()}`,
      )
      const data = (await response.json()) as PaginatedResponse<CatalogCategory>
      if (!response.ok) {
        throw new Error(data as unknown as string)
      }
      setCategories(data.data || [])
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      toast({
        title: 'Failed to load categories',
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
    loadCategories()
  }, [page, search])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await loadCategories(false)
    setIsRefreshing(false)
    setIsLoading(false)
    toast({
      title: 'Categories refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const openCreate = () => {
    setFormState(emptyForm)
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  const openEdit = (category: CatalogCategory) => {
    setFormState({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
    })
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleFormChange = (updates: Partial<CategoryFormState>) => {
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
        description: formState.description.trim() || undefined,
        imageUrl: formState.imageUrl.trim() || undefined,
      }
      const response = await fetch(
        editingCategory
          ? `/api/admin/catalog/categories/${editingCategory.id}`
          : '/api/admin/catalog/categories',
        {
          method: editingCategory ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Save failed')
      }
      toast({
        title: editingCategory ? 'Category updated' : 'Category created',
        status: 'success',
        duration: 2000,
      })
      setIsDialogOpen(false)
      setEditingCategory(null)
      setFormState(emptyForm)
      setPage(1)
      await loadCategories(false)
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
        `/api/admin/catalog/categories/${deleteTarget.id}`,
        { method: 'DELETE' },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Delete failed')
      }
      toast({
        title: 'Category deleted',
        status: 'success',
        duration: 2000,
      })
      setCategories((prev) =>
        prev.filter((entry) => entry.id !== deleteTarget.id),
      )
      setDeleteTarget(null)
      await loadCategories(false)
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
    setEditingCategory(null)
    setFormState(emptyForm)
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <AdminTableShell
        title="Catalog categories"
        description="Organize items into browsable groups."
        actions={
          <CategoryHeaderActions
            search={search}
            onSearchChange={handleSearchChange}
            onRefresh={handleRefresh}
            onAdd={openCreate}
            isRefreshing={isRefreshing}
          />
        }
      >
        <CategoriesTable
          categories={categories}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </AdminTableShell>

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        formState={formState}
        onChange={handleFormChange}
        isEditing={!!editingCategory}
        isSaving={isSaving}
      />

      <DeleteAlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category?"
        itemName={deleteTarget?.name}
        isLoading={isDeleting}
      />
    </div>
  )
}
