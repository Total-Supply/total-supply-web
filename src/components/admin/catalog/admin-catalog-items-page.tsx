'use client'

import { AdminTable, AdminTableShell } from '@/src/components/admin/admin-table'
import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { useToast } from '@/src/hooks/use-toast'
import { Input } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { Dialog } from '@chakra-ui/react'

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
  const [formState, setFormState] = useState<ItemFormState>(emptyForm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

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

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true)
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
        setIsLoading(false)
      }
    }

    loadItems()
  }, [categoryFilter, page, reloadToken, search, statusFilter, toast])

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
      setReloadToken((prev) => prev + 1)
    } catch (error: unknown) {
      let message = 'Please try again.'
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
      ) {
        message = (error as { message: string }).message
      }
      toast({
        title: 'Save failed',
        description: message,
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (item: CatalogItem) => {
    const confirmed = window.confirm(
      `Delete ${item.name}? This cannot be undone.`,
    )
    if (!confirmed) return
    try {
      const response = await fetch(`/api/admin/catalog/items/${item.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Delete failed')
      }
      toast({
        title: 'Item deleted',
        status: 'success',
        duration: 2000,
      })
      setItems((prev) => prev.filter((entry) => entry.id !== item.id))
      setReloadToken((prev) => prev + 1)
    } catch (error: unknown) {
      let message = 'Please try again.'
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
      ) {
        message = (error as { message: string }).message
      }
      toast({
        title: 'Delete failed',
        description: message,
        status: 'error',
        duration: 2500,
      })
    }
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <AdminTableShell
        title="Catalog items"
        description="Manage food inventory, pricing, and availability."
        actions={
          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search name or SKU"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="min-w-[180px]">
              <AppSelect
                placeholder="All categories"
                value={categoryFilter}
                options={[
                  { label: 'All categories', value: 'ALL' },
                  ...categories.map((category) => ({
                    label: category.name,
                    value: String(category.id),
                  })),
                ]}
                onChange={(value) => {
                  setCategoryFilter(value)
                  setPage(1)
                }}
              />
            </div>
            <div className="min-w-[160px]">
              <AppSelect
                placeholder="All statuses"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'ALL' },
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
                onChange={(value) => {
                  setStatusFilter(value)
                  setPage(1)
                }}
              />
            </div>
            <Button onClick={openCreate}>Add item</Button>
          </div>
        }
      >
        <AdminTable>
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Categories</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  Loading items...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  No items found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border/60 align-top hover:bg-muted/30"
                >
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.sku || item.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.categories.map((category) => (
                        <span
                          key={category.id}
                          className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-muted-foreground">
                    LKR {Number(item.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right text-muted-foreground">
                    {item.stock}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        item.isActive
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="solid"
                        onClick={() => handleDelete(item)}
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
                {editingItem ? 'Edit item' : 'Add catalog item'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted-foreground">
                Keep details accurate for consistent customer listings.
              </p>
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
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
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Price (LKR)
                    </label>
                    <Input
                      type="number"
                      value={formState.price}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          price: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Stock
                    </label>
                    <Input
                      type="number"
                      value={formState.stock}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          stock: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      SKU
                    </label>
                    <Input
                      value={formState.sku}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          sku: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Primary category
                  </label>
                  <AppSelect
                    placeholder="Select category"
                    value={formState.categoryId}
                    options={[
                      { label: 'Select category', value: '' },
                      ...categories.map((category) => ({
                        label: category.name,
                        value: String(category.id),
                      })),
                    ]}
                    onChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        categoryId: value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Additional categories
                  </label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {categories
                      .filter(
                        (category) =>
                          String(category.id) !== formState.categoryId,
                      )
                      .map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Checkbox
                            checked={formState.extraCategoryIds.includes(
                              category.id,
                            )}
                            onCheckedChange={(checked) => {
                              setFormState((prev) => {
                                const next = new Set(prev.extraCategoryIds)
                                if (checked) {
                                  next.add(category.id)
                                } else {
                                  next.delete(category.id)
                                }
                                return {
                                  ...prev,
                                  extraCategoryIds: Array.from(next),
                                }
                              })
                            }}
                          />
                          {category.name}
                        </label>
                      ))}
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
                      Ingredients
                    </label>
                    <Textarea
                      value={formState.ingredients}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          ingredients: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nutrition info
                    </label>
                    <Textarea
                      value={formState.nutritionInfo}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          nutritionInfo: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Main image URL
                    </label>
                    <Input
                      value={formState.mainImageUrl}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          mainImageUrl: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Gallery image URLs
                    </label>
                    <Textarea
                      placeholder="Paste each image URL on a new line"
                      value={formState.imageUrlsText}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          imageUrlsText: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={formState.isActive}
                    onCheckedChange={(checked) =>
                      setFormState((prev) => ({
                        ...prev,
                        isActive: Boolean(checked),
                      }))
                    }
                  />
                  Item is active
                </label>
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
