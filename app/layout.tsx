import type { Metadata } from 'next'
import './globals.css'
import { LoggingProvider } from '@/src/providers/LoggingProvider'

export const metadata: Metadata = {
  title: "Cogito.cv",
  description: 'I think, therefore I am. Personal portfolio of Adrian Mei.',
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
