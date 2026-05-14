import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
            <BookOpen size={20} className="text-accent" />
            <span>Headless</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Accedi</Link>
          </nav>

          <p className="text-sm text-foreground-muted">
            © {CURRENT_YEAR} Headless. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}
