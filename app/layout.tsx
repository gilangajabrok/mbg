import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme-provider'
import { SoundProvider } from '@/lib/sound-provider'
import { ToastProvider } from '@/lib/toast-provider'
import { ToastContainer } from '@/components/ui/toast-container'
import { MBGLayoutWrapper } from '@/components/layout/mbg-layout-wrapper'
import { AuthProvider } from '@/components/providers/auth-provider'

import { Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: 'MBG Premium Admin Foundation',
  description: 'Enterprise-grade admin UI system with glassmorphism, motion, and sound feedback',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_inter.className} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <SoundProvider>
              <ToastProvider>
                <MBGLayoutWrapper>
                  {children}
                </MBGLayoutWrapper>
                <ToastContainer />
              </ToastProvider>
            </SoundProvider>
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
