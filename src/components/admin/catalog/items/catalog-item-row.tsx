'use client'

import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { StatusBadge } from '@/src/components/ui/status-badge'
import { StockBadge } from '@/src/components/ui/stock-badge'
import { Edit3, Trash2 } from 'lucide-react'

import { CategoryBadge } from './category-badge'

type CatalogCategory = {
  id: number
  name: string
  slug: string
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

type CatalogItemRowProps = {
  item: CatalogItem
  onEdit: (item: CatalogItem) => void
  onDelete: (item: CatalogItem) => void
}

export function CatalogItemRow({
  item,
  onEdit,
  onDelete,
}: CatalogItemRowProps) {
  return (
    <tr className="border-t border-border/60 align-top transition-colors duration-150 hover:bg-muted/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {item.mainImageUrl && (
            <img
              src={item.mainImageUrl}
              alt={item.name}
              className="h-12 w-12 rounded-lg object-cover ring-1 ring-border"
            />
          )}
          <div className="space-y-1">
            <div className="font-medium text-foreground">{item.name}</div>
            <div className="text-xs text-muted-foreground">
              {item.sku || item.slug}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {item.categories.map((category, index) => (
            <CategoryBadge
              key={category.id}
              name={category.name}
              isPrimary={index === 0}
            />
          ))}
        </div>
      </td>
      <td className="px-4 py-4 text-right font-semibold text-foreground">
        LKR {Number(item.price).toFixed(2)}
      </td>
      <td className="px-4 py-4 text-right">
        <StockBadge stock={item.stock} />
      </td>
      <td className="px-4 py-4 text-center">
        <StatusBadge isActive={item.isActive} />
      </td>
      <td className="px-4 py-4">
        <div className="flex justify-end gap-1">
          <IconActionButton
            icon={Edit3}
            label="Edit item"
            variant="edit"
            onClick={() => onEdit(item)}
          />
          <IconActionButton
            icon={Trash2}
            label="Delete item"
            variant="delete"
            onClick={() => onDelete(item)}
          />
        </div>
      </td>
    </tr>
  )
}
