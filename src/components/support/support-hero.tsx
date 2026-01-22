'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Input } from '@/src/components/ui/input'
import { HeadphonesIcon, Search } from 'lucide-react'

type SupportHeroProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function SupportHero({ searchQuery, onSearchChange }: SupportHeroProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card/90 to-card/60 p-12 text-center shadow-lg"
    >
      <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/20 ring-4 ring-primary/10">
          <HeadphonesIcon className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          How can we help you?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Search our knowledge base or get in touch with our support team
        </p>

        <div className="mx-auto mt-8 max-w-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for articles, FAQs, or help topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-14 pl-12 text-base bg-card shadow-lg"
          />
        </div>
      </div>
    </MotionBox>
  )
}
