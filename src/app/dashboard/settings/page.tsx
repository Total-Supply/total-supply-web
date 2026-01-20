'use client'

import { MotionBox } from '@/src/components/motion/box'
import { AppearanceSettings } from '@/src/components/settings/appearance-settings'
import { GeneralSettings } from '@/src/components/settings/general-settings'
import { NotificationSettings } from '@/src/components/settings/notification-settings'
import { SecuritySettings } from '@/src/components/settings/security-settings'
import { SettingsNavigation } from '@/src/components/settings/settings-navigation'
import { useToast } from '@/src/hooks/use-toast'
import { Container } from '@chakra-ui/react'
import { Settings } from 'lucide-react'

import { useState } from 'react'

export default function SettingsPage() {
  const toast = useToast()
  const [activeSection, setActiveSection] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  const [generalData, setGeneralData] = useState({
    displayName: 'John Doe',
    email: 'john@example.com',
    bio: '',
    company: '',
  })

  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    sms: false,
    orders: true,
    marketing: false,
    updates: true,
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleGeneralChange = (field: string, value: string) => {
    setGeneralData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGeneralSave = async () => {
    setIsSaving(true)
    try {
      // API call here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: 'Settings saved',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Save failed',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: 'Preferences saved',
        status: 'success',
        duration: 2000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    toast({
      title: twoFactorEnabled ? '2FA disabled' : '2FA enabled',
      status: 'success',
      duration: 2000,
    })
  }

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string,
  ) => {
    try {
      // API call here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: 'Password updated',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Password update failed',
        status: 'error',
        duration: 2500,
      })
    }
  }

  return (
    <Container maxW="container.xl" py={6}>
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </MotionBox>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-lg sticky top-6">
            <SettingsNavigation
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeSection === 'general' && (
            <GeneralSettings
              formData={generalData}
              onChange={handleGeneralChange}
              onSave={handleGeneralSave}
              isSaving={isSaving}
            />
          )}

          {activeSection === 'appearance' && <AppearanceSettings />}

          {activeSection === 'notifications' && (
            <NotificationSettings
              preferences={notificationPrefs}
              onChange={handleNotificationChange}
              onSave={handleNotificationSave}
              isSaving={isSaving}
            />
          )}

          {activeSection === 'security' && (
            <SecuritySettings
              twoFactorEnabled={twoFactorEnabled}
              onToggleTwoFactor={handleToggleTwoFactor}
              onChangePassword={handleChangePassword}
            />
          )}

          {(activeSection === 'language' ||
            activeSection === 'connections') && (
            <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-12 text-center shadow-lg">
              <p className="text-muted-foreground">
                This section is coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
