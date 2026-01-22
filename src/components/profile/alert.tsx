'use client'

import { AlertCircle, CheckCircle2, X } from 'lucide-react'

type AlertProps = {
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

export function Alert({ type, message, onClose }: AlertProps) {
  const isSuccess = type === 'success'

  return (
    <div
      className={`rounded-lg border p-4 ${
        isSuccess
          ? 'border-emerald-500/20 bg-emerald-500/10'
          : 'border-red-500/20 bg-red-500/10'
      } flex items-start gap-3 animate-in slide-in-from-top-2 duration-300`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          isSuccess
            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30'
            : 'bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-400" />
        )}
      </div>
      <p
        className={`flex-1 text-sm font-medium ${
          isSuccess
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'
        }`}
      >
        {message}
      </p>
      <button
        onClick={onClose}
        className={`rounded-lg p-1 transition-colors ${
          isSuccess
            ? 'hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'hover:bg-red-500/20 text-red-600 dark:text-red-400'
        }`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
