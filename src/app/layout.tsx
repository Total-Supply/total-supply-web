import { SessionTimeout } from '@/src/components/auth/session-timeout'
import { AppToaster } from '@/src/components/ui/toaster'
import { ColorModeProvider } from '@/src/hooks/color-mode'
import { ChakraProvider } from '@/src/providers/chakra-provider'
import { ReduxProvider } from '@/src/providers/redux-provider'
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
        <ColorModeProvider>
          <SessionProvider>
            <ReduxProvider>
              <ChakraProvider>
                <SessionTimeout />
                <AppToaster />
                {children}
              </ChakraProvider>
            </ReduxProvider>
          </SessionProvider>
        </ColorModeProvider>
      </body>
    </html>
  )
}
