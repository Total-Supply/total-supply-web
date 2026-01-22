'use client'

import { ChakraProvider as ChakraUIProvider } from '@chakra-ui/react'

import { ReactNode } from 'react'

import { system } from '../theme'

interface ChakraProviderProps {
  children: ReactNode
}

export function ChakraProvider({ children }: ChakraProviderProps) {
  return <ChakraUIProvider value={system}>{children}</ChakraUIProvider>
}


