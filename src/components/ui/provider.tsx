'use client'

import { system } from '@/src/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'

import * as React from 'react'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
        storageKey="color-mode"
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
