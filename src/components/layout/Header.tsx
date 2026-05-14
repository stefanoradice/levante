'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, BookOpen, User } from 'lucide-react'
import type { MenuItem } from '@/types'
import { ThemeToggle } from './ThemeToggle'
import { NavLinks, MobileNavLinks } from './NavLinks'

interface HeaderProps {
  menuItems: MenuItem[]
  user: { name: string; avatarUrl: string | null } | null
}

function NavLinksFallback({ items }: { items: MenuItem[] }) {
  return (
    <>
      {items.map(({ id, url, label }) => (
        <Link
          key={id}
          href={url}
          className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted"
        >
          {label}
        </Link>
      ))}
    </>
  )
}

export function Header({ menuItems, user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-foreground">
            <BookOpen size={22} className="text-accent" />
            <span>Levante</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Suspense fallback={<NavLinksFallback items={menuItems} />}>
              <NavLinks items={menuItems} />
            </Suspense>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg
                  hover:bg-background-secondary transition-colors"
              >
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.name} width={28} height={28} className="rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                    <User size={14} className="text-accent" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground hidden lg:block">{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                  text-accent border border-accent rounded-lg
                  hover:bg-accent hover:text-white transition-colors duration-200"
              >
                <User size={16} />
                Accedi
              </Link>
            )}

            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg
                text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            <Suspense fallback={<NavLinksFallback items={menuItems} />}>
              <MobileNavLinks items={menuItems} onClose={() => setMobileOpen(false)} />
            </Suspense>
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 text-sm font-medium text-foreground text-center
                  border border-border rounded-lg hover:bg-background-secondary transition-colors"
              >
                Dashboard — {user.name}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 text-sm font-medium text-accent text-center
                  border border-accent rounded-lg hover:bg-accent hover:text-white transition-colors"
              >
                Accedi
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}
