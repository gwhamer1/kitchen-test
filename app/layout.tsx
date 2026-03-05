import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'The Kitchen Test™ | Pickleball Injury Risk Assessment',
  description:
    'Take the free 3-minute Kitchen Test™ to find out which injury will sideline you — before it happens. Used by 200+ pickleball players.',
  keywords: 'pickleball injury prevention, pickleball fitness, kitchen test, injury risk assessment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
