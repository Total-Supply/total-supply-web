'use client'

import { AdminTableShell } from '@/src/components/admin/admin-table'
import { CatalogFilters } from '@/src/components/admin/catalog/items/catalog-filters'
import { CatalogItemDialog } from '@/src/components/admin/catalog/items/catalog-item-dialog'
import { CatalogItemsTable } from '@/src/components/admin/catalog/items/catalog-items-table'
import { DeleteAlertDialog } from '@/src/components/admin/delete-alert-dialog'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { useToast } from '@/src/hooks/use-toast'
import { Plus, RefreshCw } from 'lucide-react'

import { useEffect, useState } from 'react'

type CatalogCategory = {
  id: number
  name: string
  slug: string
  itemCount?: number
}

type CatalogItem = {
  id: number
  name: string
  slug: string
  price: number | string
  stock: number
  sku?: string | null
  isActive: boolean
  mainImageUrl?: string | null
  categories: CatalogCategory[]
}

type ItemDetail = CatalogItem & {
  description?: string | null
  ingredients?: string | null
  nutritionInfo?: string | null
  category?: CatalogCategory | null
  images?: { id: number; url: string }[]
}

type PaginatedResponse<T> = {
  data: T[]
  meta?: {
    page: number
    totalPages: number
  }
}

type ItemFormState = {
  name: string
  slug: string
  price: string
  stock: string
  sku: string
  description: string
  ingredients: string
  nutritionInfo: string
  mainImageUrl: string
  categoryId: string
  extraCategoryIds: number[]
  imageUrlsText: string
  isActive: boolean
}

const emptyForm: ItemFormState = {
  name: '',
  slug: '',
  price: '',
  stock: '0',
  sku: '',
  description: '',
  ingredients: '',
  nutritionInfo: '',
  mainImageUrl: '',
  categoryId: '',
  extraCategoryIds: [],
  imageUrlsText: '',
  isActive: true,
}

export function AdminCatalogItemsPage() {
  const toast = useToast()
  const [items, setItems] = useState<CatalogItem[]>([])
  const [categories, setCategories] = useState<CatalogCategory[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [formState, setFormState] = useState<ItemFormState>(emptyForm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/admin/catalog/categories?limit=200')
        const data =
          (await response.json()) as PaginatedResponse<CatalogCategory>
        if (!response.ok) {
          throw new Error(data as unknown as string)
        }
        setCategories(data.data || [])
      } catch (error) {
        toast({
          title: 'Failed to load categories',
          status: 'error',
          duration: 2500,
        })
      }
    }

    loadCategories()
  }, [toast])

  const loadItems = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      })
      if (search) params.set('search', search)
      if (categoryFilter !== 'ALL') {
        params.set('categoryId', categoryFilter)
      }
      if (statusFilter !== 'ALL') {
        params.set('isActive', statusFilter === 'ACTIVE' ? 'true' : 'false')
      }
      const response = await fetch(
        `/api/admin/catalog/items?${params.toString()}`,
      )
      const data = (await response.json()) as PaginatedResponse<CatalogItem>
      if (!response.ok) {
        throw new Error(data as unknown as string)
      }
      setItems(data.data || [])
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      toast({
        title: 'Failed to load items',
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
    loadItems()
  }, [categoryFilter, page, search, statusFilter])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await loadItems(false)
    setIsRefreshing(false)
    setIsLoading(false)
    toast({
      title: 'Items refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const openCreate = () => {
    setFormState(emptyForm)
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  const openEdit = async (item: CatalogItem) => {
    try {
      const response = await fetch(`/api/admin/catalog/items/${item.id}`)
      const data = (await response.json()) as { data: ItemDetail }
      if (!response.ok) {
        throw new Error(data as unknown as string)
      }
      const detail = data.data
      const primaryId = detail.category?.id?.toString() || ''
      const allCategories = detail.categories || []
      setFormState({
        name: detail.name,
        slug: detail.slug,
        price: String(detail.price ?? ''),
        stock: String(detail.stock ?? 0),
        sku: detail.sku || '',
        description: detail.description || '',
        ingredients: detail.ingredients || '',
        nutritionInfo: detail.nutritionInfo || '',
        mainImageUrl: detail.mainImageUrl || '',
        categoryId: primaryId,
        extraCategoryIds: allCategories
          .filter((category) => String(category.id) !== primaryId)
          .map((category) => category.id),
        imageUrlsText:
          detail.images?.map((image) => image.url).join('\n') || '',
        isActive: detail.isActive,
      })
      setEditingItem(item)
      setIsDialogOpen(true)
    } catch (error) {
      toast({
        title: 'Failed to load item',
        status: 'error',
        duration: 2500,
      })
    }
  }

  const handleFormChange = (updates: Partial<ItemFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }))
  }

  const handleSave = async () => {
    if (!formState.name.trim() || !formState.price || !formState.categoryId) {
      toast({
        title: 'Missing required fields',
        description: 'Name, price, and primary category are required.',
        status: 'warning',
        duration: 2500,
      })
      return
    }

    setIsSaving(true)
    try {
      const imageUrls = formState.imageUrlsText
        .split(/[\n,]+/)
        .map((entry) => entry.trim())
        .filter(Boolean)

      const payload = {
        name: formState.name.trim(),
        slug: formState.slug.trim() || undefined,
        price: Number(formState.price),
        stock: Number(formState.stock || 0),
        sku: formState.sku.trim() || undefined,
        description: formState.description.trim() || undefined,
        ingredients: formState.ingredients.trim() || undefined,
        nutritionInfo: formState.nutritionInfo.trim() || undefined,
        mainImageUrl: formState.mainImageUrl.trim() || undefined,
        categoryId: Number(formState.categoryId),
        categoryIds: Array.from(
          new Set([
            Number(formState.categoryId),
            ...formState.extraCategoryIds,
          ]),
        ),
        imageUrls: imageUrls.length ? imageUrls : undefined,
        isActive: formState.isActive,
      }

      const response = await fetch(
        editingItem
          ? `/api/admin/catalog/items/${editingItem.id}`
          : '/api/admin/catalog/items',
        {
          method: editingItem ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Save failed')
      }
      toast({
        title: editingItem ? 'Item updated' : 'Item created',
        status: 'success',
        duration: 2000,
      })
      setIsDialogOpen(false)
      setEditingItem(null)
      setFormState(emptyForm)
      setPage(1)
      await loadItems(false)
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
        `/api/admin/catalog/items/${deleteTarget.id}`,
        { method: 'DELETE' },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Delete failed')
      }
      toast({
        title: 'Item deleted',
        status: 'success',
        duration: 2000,
      })
      setItems((prev) => prev.filter((entry) => entry.id !== deleteTarget.id))
      setDeleteTarget(null)
      await loadItems(false)
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

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormState(emptyForm)
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <AdminTableShell
        title="Catalog items"
        description="Manage food inventory, pricing, and availability."
        actions={
          <div className="flex items-center gap-2">
            <IconActionButton
              icon={RefreshCw}
              label="Refresh items"
              variant="refresh"
              isLoading={isRefreshing}
              onClick={handleRefresh}
            />
            <CatalogFilters
              search={search}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              categories={categories}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onStatusChange={handleStatusChange}
            />
            <Button
              onClick={openCreate}
              leftIcon={<Plus className="h-4 w-4" />}
              colorPalette="teal"
              variant="outline"
              size="sm"
            >
              Add Item
            </Button>
          </div>
        }
      >
        <CatalogItemsTable
          items={items}
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

      <CatalogItemDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        formState={formState}
        onChange={handleFormChange}
        categories={categories}
        isEditing={!!editingItem}
        isSaving={isSaving}
      />

      <DeleteAlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Catalog Item"
        description="Are you sure you want to delete this item?"
        itemName={deleteTarget?.name}
        isLoading={isDeleting}
      />
    </div>
  )
}
