'use client'

import { AdminTable, AdminTableShell } from '@/src/components/admin/admin-table'
import { useToast } from '@/src/hooks/use-toast'
import { Textarea } from '@chakra-ui/react'
import { Dialog } from '@chakra-ui/react'

import { useEffect, useState } from 'react'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'

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
  const [formState, setFormState] = useState<CategoryFormState>(emptyForm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<CatalogCategory | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '10',
        })
        if (search) params.set('search', search)
        const response = await fetch(
          `/api/admin/catalog/categories?${params.toString()}`,
        )
        const data =
          (await response.json()) as PaginatedResponse<CatalogCategory>
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
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [page, reloadToken, search, toast])

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
      setReloadToken((prev) => prev + 1)
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

  const handleDelete = async (category: CatalogCategory) => {
    const confirmed = window.confirm(
      `Delete ${category.name}? This cannot be undone.`,
    )
    if (!confirmed) return
    try {
      const response = await fetch(
        `/api/admin/catalog/categories/${category.id}`,
        {
          method: 'DELETE',
        },
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
      setCategories((prev) => prev.filter((entry) => entry.id !== category.id))
      setReloadToken((prev) => prev + 1)
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
        title="Catalog categories"
        description="Organize items into browsable groups."
        actions={
          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search category name"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </div>
            <Button onClick={openCreate}>Add category</Button>
          </div>
        }
      >
        <AdminTable>
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-right">Items</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-border/60 hover:bg-muted/30"
                >
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {category.name}
                      </div>
                      {category.description ? (
                        <div className="text-xs text-muted-foreground">
                          {category.description}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {category.slug}
                  </td>
                  <td className="px-4 py-4 text-right text-muted-foreground">
                    {category.itemCount ?? 0}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="solid"
                        onClick={() => handleDelete(category)}
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

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
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
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
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
                {editingCategory ? 'Edit category' : 'Add category'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted-foreground">
                Categories help customers filter the catalog.
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Image URL
                  </label>
                  <Input
                    value={formState.imageUrl}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        imageUrl: event.target.value,
                      }))
                    }
                  />
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
