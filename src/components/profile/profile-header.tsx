'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Settings, User } from 'lucide-react'

type ProfileHeaderProps = {
  name: string
  email: string
  profileImage?: string | null
  completionPercentage: number
}

export function ProfileHeader({
  name,
  email,
  profileImage,
  completionPercentage,
}: ProfileHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-primary/20">
              <AvatarImage src={profileImage || undefined} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold text-primary">
                {name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 ring-2 ring-card">
              <Settings className="h-3 w-3 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold">{name || 'User'}</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Profile Completion
            </span>
            <span className="text-xs font-bold text-foreground">
              {completionPercentage}%
            </span>
          </div>
          <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {completionPercentage === 100
              ? 'Profile complete!'
              : 'Complete your profile to unlock all features'}
          </p>
        </div>
      </div>
    </MotionBox>
  )
}
