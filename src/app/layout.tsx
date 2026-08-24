import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NIRIKSHAN — MPLADS Forensic Intelligence Platform',
  description: 'AI-powered forensic intelligence and early-warning platform for MPLADS. See the pattern before the loss.',
  keywords: ['MPLADS', 'fraud detection', 'AI', 'forensic', 'government', 'transparency', 'SIH 2026'],
  openGraph: {
    title: 'NIRIKSHAN',
    description: 'See the pattern before the loss.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#020A12] text-[#EAF7FF]">
        {children}
      </body>
    </html>
  )
}