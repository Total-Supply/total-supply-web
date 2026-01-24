'use client'

import { MotionBox } from '@/src/components/motion/box'
import { LucideIcon } from 'lucide-react'

import { ReactNode } from 'react'

interface Section {
  title: string
  content: ReactNode
}

interface PolicyPageProps {
  icon: LucideIcon
  title: string
  description: string
  lastUpdated: string
  sections: Section[]
}

export function PolicyPageTemplate({
  icon: Icon,
  title,
  description,
  lastUpdated,
  sections,
}: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-16 sm:py-20 lg:py-24">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 shadow-lg">
                <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 sm:mb-4">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-3">
              {description}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </MotionBox>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert mx-auto max-w-4xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
              {sections.map((section, index) => (
                <section key={index}>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4">
                    {section.title}
                  </h2>
                  <div className="text-sm sm:text-base text-muted-foreground leading-relaxed space-y-3">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </MotionBox>
        </article>
      </div>
    </div>
  )
}
