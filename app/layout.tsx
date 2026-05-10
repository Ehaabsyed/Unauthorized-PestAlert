import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'AgriTech Sentinel | AI-Powered Agricultural Intelligence',
  description:
    'Advanced AI-powered agricultural monitoring platform for pest detection, weather forecasting, and smart farming solutions.',
  keywords: ['agriculture', 'AI', 'pest detection', 'farming', 'weather', 'crop monitoring'],
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AgriTech Sentinel',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
      { url: '/icon-192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icon-512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  openGraph: {
    title: 'AgriTech Sentinel | AI-Powered Agricultural Intelligence',
    description:
      'Advanced AI-powered agricultural monitoring platform for pest detection, weather forecasting, and smart farming solutions.',
    images: [{ url: '/logo.png', width: 1024, height: 1024, alt: 'AgriTech Sentinel' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'AgriTech Sentinel',
    description: 'AI-powered agricultural intelligence platform.',
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5E9C12' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1F0B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
