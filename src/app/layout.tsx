import { SessionTimeout } from '@/src/components/auth/session-timeout'
import { Provider } from '@/src/components/ui/provider'
import { AppToaster } from '@/src/components/ui/toaster'
import { ReduxProvider } from '@/src/providers/redux-provider'
import { SessionProvider } from '@/src/providers/session-provider'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

import './globals.css'

// Optimized font loading with next/font - automatic font-display: swap
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Total Supply - Fresh & Fast Delivery',
    template: '%s | Total Supply',
  },
  description:
    'Your trusted partner for quality products and exceptional service',
  icons: {
    icon: [
      { url: '/images/logo/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/images/logo/logo.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
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
