import { SessionTimeout } from '@/src/components/auth/session-timeout'
import { Provider } from '@/src/components/ui/provider'
import { AppToaster } from '@/src/components/ui/toaster'
import { ReduxProvider } from '@/src/providers/redux-provider'
import { SessionProvider } from '@/src/providers/session-provider'
import '@fontsource-variable/inter'
import type { Metadata } from 'next'
import 'swagger-ui-react/swagger-ui.css'

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Provider>
          <SessionProvider>
            <ReduxProvider>
              <SessionTimeout />
              <AppToaster />
              {children}
            </ReduxProvider>
          </SessionProvider>
        </Provider>
      </body>
    </html>
  )
}
