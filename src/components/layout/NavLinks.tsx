'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import type { MenuItem } from '@/types'

interface NavLinksProps {
  items: MenuItem[]
}

export function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <>
      {items.map(({ id, url, label }) => {
        const to = url
        const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
        return (
          <Link
            key={id}
            href={to}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
              ${isActive
                ? 'text-foreground'
                : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
              }`}
          >
            {label}
            {isActive && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent rounded-full"
              />
            )}
          </Link>
        )
      })}
    </>
  )
}

export function MobileNavLinks({ items, onClose }: NavLinksProps & { onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {items.map(({ id, url, label }) => {
        const to = url
        const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
        return (
          <Link
            key={id}
            href={to}
            onClick={onClose}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${isActive
                ? 'text-accent bg-accent-subtle'
                : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
              }`}
          >
            {label}
          </Link>
        )
      })}
    </>
  )
}
