'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Briefcase, Mail, User } from 'lucide-react'

type GeneralSettingsProps = {
  formData: {
    displayName: string
    email: string
    bio: string
    company: string
  }
  onChange: (field: string, value: string) => void
  onSave: () => void
  isSaving: boolean
}

export function GeneralSettings({
  formData,
  onChange,
  onSave,
  isSaving,
}: GeneralSettingsProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5 flex-shrink-0" />
          <span>General Settings</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Display Name
          </label>
          <Input
            placeholder="Your display name"
            value={formData.displayName}
            onChange={(e) => onChange('displayName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            Email Address
          </label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            disabled
            className="bg-muted/50"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed directly
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            Company
          </label>
          <Input
            placeholder="Your company name"
            value={formData.company}
            onChange={(e) => onChange('company', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <Textarea
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border/60">
          <Button
            onClick={onSave}
            loading={isSaving}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </MotionBox>
  )
}
