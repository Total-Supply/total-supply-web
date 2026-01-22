'use client'

import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Edit3, Trash2 } from 'lucide-react'

import { ItemCountBadge } from './item-count-badge'

type CatalogCategory = {
  id: number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  itemCount?: number
}

type CategoryRowProps = {
  category: CatalogCategory
  onEdit: (category: CatalogCategory) => void
  onDelete: (category: CatalogCategory) => void
}

export function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  return (
    <tr className="border-t border-border/60 transition-colors duration-150 hover:bg-muted/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {category.imageUrl && (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-12 w-12 rounded-lg object-cover ring-1 ring-border"
            />
          )}
          <div className="space-y-1">
            <div className="font-medium text-foreground">{category.name}</div>
            {category.description && (
              <div className="text-xs text-muted-foreground line-clamp-1">
                {category.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
          {category.slug}
        </code>
      </td>
      <td className="px-4 py-4 text-right">
        <ItemCountBadge count={category.itemCount ?? 0} />
      </td>
      <td className="px-4 py-4">
        <div className="flex justify-end gap-1">
          <IconActionButton
            icon={Edit3}
            label="Edit category"
            variant="edit"
            onClick={() => onEdit(category)}
          />
          <IconActionButton
            icon={Trash2}
            label="Delete category"
            variant="delete"
            onClick={() => onDelete(category)}
          />
        </div>
      </td>
    </tr>
  )
}
