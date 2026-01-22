'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'
import { Upload } from 'lucide-react'

type OrderRowFormProps = {
  status: string
  notes: string
  onStatusChange: (value: string) => void
  onNotesChange: (value: string) => void
  onFileChange: (file: File | null) => void
  statusOptions: { label: string; value: string }[]
  proofFile: File | null
  isUploading?: boolean
}

export function OrderRowForm({
  status,
  notes,
  onStatusChange,
  onNotesChange,
  onFileChange,
  statusOptions,
  proofFile,
  isUploading = false,
}: OrderRowFormProps) {
  return (
    <div className="space-y-2">
      <AppSelect
        value={status}
        options={statusOptions}
        onChange={onStatusChange}
      />
      <Input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
      />
      {status === 'DELIVERED' && (
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            className="cursor-pointer"
          />
          {proofFile && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Upload className="h-3 w-3" />
              <span className="line-clamp-1">{proofFile.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
