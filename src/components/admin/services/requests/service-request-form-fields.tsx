'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'

type StaffOption = {
  id: number
  name: string
}

type ServiceRequestFormFieldsProps = {
  status: string
  staffId: string
  notes: string
  onStatusChange: (value: string) => void
  onStaffChange: (value: string) => void
  onNotesChange: (value: string) => void
  statusOptions: { label: string; value: string }[]
  staffOptions: StaffOption[]
  isUploading?: boolean
  onFileUpload?: (files: FileList | null) => void
}

export function ServiceRequestFormFields({
  status,
  staffId,
  notes,
  onStatusChange,
  onStaffChange,
  onNotesChange,
  statusOptions,
  staffOptions,
  isUploading = false,
  onFileUpload,
}: ServiceRequestFormFieldsProps) {
  const staffOptionsList = [
    { label: 'Assign staff', value: '' },
    ...staffOptions.map((staff) => ({
      label: staff.name,
      value: String(staff.id),
    })),
  ]

  return (
    <div className="space-y-2">
      <AppSelect
        value={status}
        options={statusOptions}
        onChange={onStatusChange}
      />
      <AppSelect
        placeholder="Assign staff"
        value={staffId}
        options={staffOptionsList}
        onChange={onStaffChange}
      />
      <Input
        placeholder="Completion notes"
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
      />
      {status === 'RESOLVED' && onFileUpload && (
        <Input
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading}
          onChange={(event) => onFileUpload(event.target.files)}
          className="cursor-pointer"
        />
      )}
    </div>
  )
}
