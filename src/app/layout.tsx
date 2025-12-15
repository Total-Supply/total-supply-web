import { ChakraProvider } from '@/src/providers/chakra-provider'
import { SessionProvider } from '@/src/providers/session-provider'
import '@fontsource-variable/inter'
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Total Supply',
  description: 'Complete supply chain management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
