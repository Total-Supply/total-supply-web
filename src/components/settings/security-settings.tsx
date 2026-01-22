'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { AlertTriangle, Key, Shield, Smartphone } from 'lucide-react'

import { useState } from 'react'

type SecuritySettingsProps = {
  twoFactorEnabled: boolean
  onToggleTwoFactor: () => void
  onChangePassword: (oldPassword: string, newPassword: string) => void
}

export function SecuritySettings({
  twoFactorEnabled,
  onToggleTwoFactor,
  onChangePassword,
}: SecuritySettingsProps) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    onChangePassword(oldPassword, newPassword)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Change Password */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Update your password regularly for better security
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Current Password
            </label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Confirm New Password
            </label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
              <Smartphone className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add an extra layer of security to your account
              </p>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    twoFactorEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
                  }`}
                >
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant={twoFactorEnabled ? 'outline' : 'solid'}
            colorPalette={twoFactorEnabled ? 'red' : 'green'}
            onClick={onToggleTwoFactor}
          >
            {twoFactorEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>

      {/* Security Alert */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-600/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-600 dark:text-amber-400">
              Security Tips
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-600/80 dark:text-amber-400/80">
              <li>• Use a strong, unique password</li>
              <li>• Enable two-factor authentication</li>
              <li>• Never share your password with anyone</li>
              <li>• Update your password regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
