import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getMenuRepository } from '@/lib/repositories/factory'
import { getValidatedSession } from '@/lib/auth/session'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Blog',
    template: '%s | Blog',
  },
  description: 'Il nostro blog.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [menuItems, session] = await Promise.all([
    getMenuRepository().getMenuBySlug('primary').catch(() => []),
    getValidatedSession().catch(() => null),
  ])

  return (
    <html
      lang="it"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Providers isLoggedIn={!!session}>
          <Header menuItems={menuItems} user={session ? { name: session.name, avatarUrl: session.avatarUrl } : null} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
