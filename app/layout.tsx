import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/components/theme-provider'
import { SplashCursorGate } from '@/components/effects'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sync Map - Real-time Location Synchronization',
  description: 'Live location sharing platform with instant tracker-to-viewer map synchronization.',
  generator: 'v0.app',
  keywords: ['location', 'sync', 'real-time', 'tracker', 'map', 'websocket'],
  authors: [{ name: 'Sync Map Team' }],
  icons: {
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_GPS_map_marker.svg',
    apple: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_GPS_map_marker.svg',
    shortcut: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_GPS_map_marker.svg',
  },
  openGraph: {
    title: 'Sync Map',
    description: 'Real-time location synchronization platform',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <ThemeProvider>
          <SplashCursorGate />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
