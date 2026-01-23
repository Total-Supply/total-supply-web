'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Text } from '@chakra-ui/react'
import { Info, Sparkles, X } from 'lucide-react'

type ServiceHeaderProps = {
  showInfo: boolean
  onToggleInfo: () => void
}

export function ServiceHeader({ showInfo, onToggleInfo }: ServiceHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Title Section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Request a Service
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Book cleaning or IT support with a quick request, upload photos, and
          receive a confirmed time slot
        </p>
      </div>

      {/* Stats Row - Fixed */}
      <div className="flex justify-center">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <Text color="muted">Response within 2 hours</Text>
          </div>

          <div className="hidden sm:block h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <Text color="muted">Available 24/7</Text>
          </div>

          <div className="hidden sm:block h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <Text color="muted">Professional service</Text>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onToggleInfo}
          className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted lg:hidden"
        >
          <Info className="h-4 w-4" />
          {showInfo ? 'Hide' : 'Show'} Info
        </button>

        {/* Optional: Service type badge */}
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Cleaning & IT Support
          </span>
        </div>
      </div>
    </MotionBox>
  )
}
