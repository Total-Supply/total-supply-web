'use client'

import { MotionBox } from '@/src/components/motion/box'
import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { AlertCircle, Loader2, X } from 'lucide-react'

import { useState } from 'react'

const CANCEL_REASONS = [
  'Changed mind',
  'Out of stock',
  'Address issue',
  'Delivery time too long',
  'Duplicate order',
  'Found better price',
  'Other',
]

type CancelOrderModalProps = {
  isOpen: boolean
  orderNumber: string
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
}

export function CancelOrderModal({
  isOpen,
  orderNumber,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState(CANCEL_REASONS[0])
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm(reason)
      onClose()
    } catch (error) {
      // Error handling done in parent
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <MotionBox
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Cancel Order</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Order #{orderNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Please select a reason for canceling this order. This will help us
            improve our service.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cancellation Reason</label>
            <AppSelect
              value={reason}
              onChange={setReason}
              options={CANCEL_REASONS.map((r) => ({
                label: r,
                value: r,
              }))}
              isDisabled={isLoading}
            />
          </div>

          {/* Warning */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
                  This action cannot be undone
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Your order will be canceled immediately and you will receive a
                  confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border/60 p-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Keep Order
          </Button>
          <Button
            colorPalette="red"
            className="flex-1"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Canceling...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel Order
              </>
            )}
          </Button>
        </div>
      </MotionBox>
    </div>
  )
}
