'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Bell, Mail, MessageSquare, ShoppingBag } from 'lucide-react'

import { Button } from '../ui/button'

type NotificationSettingsProps = {
  preferences: {
    email: boolean
    push: boolean
    sms: boolean
    orders: boolean
    marketing: boolean
    updates: boolean
  }
  onChange: (key: string, value: boolean) => void
  onSave: () => void
  isSaving: boolean
}

export function NotificationSettings({
  preferences,
  onChange,
  onSave,
  isSaving,
}: NotificationSettingsProps) {
  const notificationTypes = [
    {
      key: 'email',
      icon: Mail,
      label: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      key: 'push',
      icon: Bell,
      label: 'Push Notifications',
      description: 'Receive push notifications in your browser',
    },
    {
      key: 'sms',
      icon: MessageSquare,
      label: 'SMS Notifications',
      description: 'Receive important updates via SMS',
    },
  ]

  const contentPreferences = [
    {
      key: 'orders',
      icon: ShoppingBag,
      label: 'Order Updates',
      description: 'Get notified about your orders',
    },
    {
      key: 'marketing',
      icon: Mail,
      label: 'Marketing Emails',
      description: 'Receive promotional offers and news',
    },
    {
      key: 'updates',
      icon: Bell,
      label: 'Product Updates',
      description: 'Stay informed about new features',
    },
  ]

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 flex-shrink-0" />
          <span>Notification Preferences</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how you want to be notified
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">Notification Channels</h3>
          <div className="space-y-3">
            {notificationTypes.map((type) => {
              const Icon = type.icon
              return (
                <div
                  key={type.key}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3 sm:p-4"
                >
                  <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">
                      {type.label}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {type.description}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences[type.key as keyof typeof preferences]}
                    onChange={(e) => onChange(type.key, e.target.checked)}
                    className="h-5 w-5 flex-shrink-0 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-0.5"
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Content Preferences</h3>
          <div className="space-y-3">
            {contentPreferences.map((pref) => {
              const Icon = pref.icon
              return (
                <div
                  key={pref.key}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3 sm:p-4"
                >
                  <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">
                      {pref.label}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {pref.description}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences[pref.key as keyof typeof preferences]}
                    onChange={(e) => onChange(pref.key, e.target.checked)}
                    className="h-5 w-5 flex-shrink-0 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-0.5"
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border/60">
          <Button
            onClick={onSave}
            loading={isSaving}
            className="w-full sm:w-auto"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </MotionBox>
  )
}
