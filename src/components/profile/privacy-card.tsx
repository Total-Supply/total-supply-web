'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { AlertTriangle, Download, Mail } from 'lucide-react'

type PrivacyCardProps = {
  marketingOptIn: boolean
  deletionScheduledAt?: string | null
  isUpdatingMarketing: boolean
  onMarketingChange: (checked: boolean) => void
  onDownload: () => void
  onDeleteRequest: () => void
  onRestore: () => void
}

export function PrivacyCard({
  marketingOptIn,
  deletionScheduledAt,
  isUpdatingMarketing,
  onMarketingChange,
  onDownload,
  onDeleteRequest,
  onRestore,
}: PrivacyCardProps) {
  const deletionScheduledLabel = deletionScheduledAt
    ? new Date(deletionScheduledAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Download Data Card */}
      <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Privacy & Data</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Download your data or manage your privacy preferences
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download My Data
          </Button>
        </div>
      </div>

      {/* Marketing Preferences */}
      <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold">
              Marketing Preferences
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Receive updates about new offers and service announcements
            </p>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => onMarketingChange(e.target.checked)}
                disabled={isUpdatingMarketing}
                className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
              <label className="text-sm">
                I want to receive marketing emails
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="rounded-xl sm:rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-600/5 p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-400">
              Delete My Account
            </h3>
            <p className="text-xs sm:text-sm text-red-600/80 dark:text-red-400/80 mt-1">
              We will anonymize your data after 30 days. Orders and services are
              retained for legal reasons without personal identifiers.
            </p>
            {deletionScheduledLabel && (
              <div className="mt-3 rounded-lg bg-red-500/10 p-3 border border-red-500/20">
                <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">
                  Scheduled for anonymization on {deletionScheduledLabel}.
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                  You can restore your account before then.
                </p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {deletionScheduledAt ? (
                <Button
                  variant="outline"
                  colorPalette="green"
                  size="sm"
                  onClick={onRestore}
                  className="w-full sm:w-auto"
                >
                  Restore Account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  colorPalette="red"
                  size="sm"
                  onClick={onDeleteRequest}
                  className="w-full sm:w-auto"
                >
                  Request Deletion
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
