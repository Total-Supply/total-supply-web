'use client'

import * as React from 'react'

export type ColorMode = 'light' | 'dark'

type ColorModeContextValue = {
  colorMode: ColorMode
  setColorMode: (value: ColorMode) => void
  toggleColorMode: () => void
}

const ColorModeContext = React.createContext<ColorModeContextValue | undefined>(
  undefined,
)

function getInitialColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem('color-mode')
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] =
    React.useState<ColorMode>(getInitialColorMode)

  React.useEffect(() => {
    window.localStorage.setItem('color-mode', colorMode)
    document.documentElement.classList.toggle('dark', colorMode === 'dark')
    document.documentElement.classList.toggle('light', colorMode === 'light')
  }, [colorMode])

  const toggleColorMode = React.useCallback(() => {
    setColorMode((m) => (m === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = React.useMemo(
    () => ({ colorMode, setColorMode, toggleColorMode }),
    [colorMode, toggleColorMode],
  )

  return React.createElement(ColorModeContext.Provider, { value }, children)
}

export function useColorMode() {
  const ctx = React.useContext(ColorModeContext)
  if (!ctx)
    throw new Error('useColorMode must be used inside <ColorModeProvider>')
  return ctx
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}
