'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Bell, CreditCard, Shield, User } from 'lucide-react'

type ProfileSidebarProps = {
  activeSection: string
  onSectionChange: (section: string) => void
  name: string
  email: string
  profileImage?: string | null
  completionPercentage: number
}

const navItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export function ProfileSidebar({
  activeSection,
  onSectionChange,
  name,
  email,
  profileImage,
  completionPercentage,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarImage src={profileImage || undefined} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-base font-semibold text-primary">
              {name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Profile Completion
            </span>
            <span className="text-xs font-bold">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {completionPercentage === 100
              ? 'Profile complete!'
              : 'Complete your profile'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
