import type { Metadata } from 'next'
import { Montserrat, Space_Mono } from 'next/font/google'

import './globals.css'

const sansFont = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const monoFont = Space_Mono({
  variable: '--font-code',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Panatech Invoice',
  description: 'Modern invoicing SaaS dashboard with secure auth, analytics, and PDF exports.',
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} ${monoFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
