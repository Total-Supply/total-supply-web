'use client'

import { Bell, CreditCard, Shield, User } from 'lucide-react'

type ProfileTabsProps = {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export function ProfileTabs({
  activeSection,
  onSectionChange,
}: ProfileTabsProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-2 shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide gap-2">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex flex-col items-center gap-1.5 rounded-lg px-4 py-3 min-w-[80px] transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium whitespace-nowrap">
                {section.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
