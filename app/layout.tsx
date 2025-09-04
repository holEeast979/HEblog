import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Navigation } from '@/components/layout/navigation'
import { ParticlesBackground } from '@/components/animations/particles-background'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HEblog - AI与编程知识分享',
  description: '分享AI、Java、Python等编程知识和个人理解',
  keywords: ['AI', 'Java', 'Python', '编程', '人工智能', '知识分享'],
  authors: [{ name: 'HE' }],
  creator: 'HE',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://heblog.vercel.app',
    title: 'HEblog - AI与编程知识分享',
    description: '分享AI、Java、Python等编程知识和个人理解',
    siteName: 'HEblog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEblog - AI与编程知识分享',
    description: '分享AI、Java、Python等编程知识和个人理解',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} smooth-text antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <ParticlesBackground />
            <div className="relative min-h-screen bg-gradient-to-br from-primary-50 via-warm-50 to-primary-100 dark:from-dark-900 dark:via-dark-800 dark:to-primary-900 transition-all duration-300">
              <Navigation />
              <main className="relative z-10">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
