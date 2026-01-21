'use client'

import { useTheme } from 'next-themes'

import * as React from 'react'

export type ColorMode = 'light' | 'dark'

export function useColorMode() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const colorMode: ColorMode =
    resolvedTheme === 'dark' || theme === 'dark' ? 'dark' : 'light'

  const setColorMode = React.useCallback(
    (value: ColorMode) => setTheme(value),
    [setTheme],
  )

  const toggleColorMode = React.useCallback(() => {
    setTheme(colorMode === 'dark' ? 'light' : 'dark')
  }, [colorMode, setTheme])

  return { colorMode, setColorMode, toggleColorMode }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}
