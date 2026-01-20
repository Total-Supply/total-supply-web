'use client'

import { Bell, Globe, Link, Palette, Shield, User } from 'lucide-react'

type SettingsNavigationProps = {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sections = [
  { id: 'general', label: 'General', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'connections', label: 'Connected Accounts', icon: Link },
]

export function SettingsNavigation({
  activeSection,
  onSectionChange,
}: SettingsNavigationProps) {
  return (
    <div className="space-y-1">
      {sections.map((section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{section.label}</span>
          </button>
        )
      })}
    </div>
  )
}
