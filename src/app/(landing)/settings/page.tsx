'use client'

import { MotionBox } from '@/src/components/motion/box'
import { AppearanceSettings } from '@/src/components/settings/appearance-settings'
import { GeneralSettings } from '@/src/components/settings/general-settings'
import { NotificationSettings } from '@/src/components/settings/notification-settings'
import { SecuritySettings } from '@/src/components/settings/security-settings'
import { SettingsNavigation } from '@/src/components/settings/settings-navigation'
import { SettingsTabs } from '@/src/components/settings/settings-tabs'
import { useToast } from '@/src/hooks/use-toast'
import { Container, useBreakpointValue } from '@chakra-ui/react'
import { Settings } from 'lucide-react'

import { useState } from 'react'

export default function SettingsPage() {
  const toast = useToast()
  const [activeSection, setActiveSection] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const isMobile = useBreakpointValue({ base: true, lg: false })

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
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container
          maxW="container.xl"
          className="relative px-8 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-12"
        >
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 shadow-lg">
                <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
              Settings
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </MotionBox>
        </Container>
      </div>

      {/* Main Content */}
      <Container
        maxW="container.xl"
        className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      >
        {/* Mobile: Tabs Navigation */}
        {isMobile && (
          <div className="mb-6">
            <SettingsTabs
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        )}

        {/* Desktop: Sidebar + Content */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Desktop Sidebar Navigation */}
          {!isMobile && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm">
                <SettingsNavigation
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div>
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
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-12 sm:p-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  This section is currently under development and will be
                  available soon.
                </p>
              </MotionBox>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
