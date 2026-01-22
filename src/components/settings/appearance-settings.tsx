'use client'

import { MotionBox } from '@/src/components/motion/box'
import { ColorMode, useColorMode } from '@/src/hooks/color-mode'
import { Monitor, Moon, Palette, Sun } from 'lucide-react'

export function AppearanceSettings() {
  const { colorMode, setColorMode } = useColorMode()

  const themes: {
    id: ColorMode
    label: string
    icon: React.ElementType
    description: string
  }[] = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Light theme' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme' },
  ]

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize how the application looks
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme) => {
              const Icon = theme.icon
              const isActive = colorMode === theme.id

              return (
                <button
                  key={theme.id}
                  onClick={() => setColorMode(theme.id)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all duration-200 ${
                    isActive
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border/60 hover:border-border hover:bg-muted/50'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}
                  >
                    {theme.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
