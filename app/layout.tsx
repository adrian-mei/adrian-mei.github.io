import type { Metadata } from 'next'
import './globals.css'
import { LoggingProvider } from '@/src/components/features/analytics/LoggingProvider'

export const metadata: Metadata = {
  title: "Adrian's Portfolio",
  description: 'Personal portfolio of Adrian Mei',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LoggingProvider>
          {children}
        </LoggingProvider>
      </body>
    </html>
  )
}
