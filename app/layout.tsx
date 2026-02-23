import type { Metadata } from 'next'
import { Cinzel, Manrope, Space_Mono } from 'next/font/google'

import './globals.css'

const displayFont = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const bodyFont = Manrope({
  variable: '--font-body',
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
  description: 'Golden invoicing SaaS dashboard with settings, persistence, and PDF exports.',
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
