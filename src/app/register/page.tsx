'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, BookOpen } from 'lucide-react'
import { registerAction } from '@/lib/auth/actions'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null)

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen size={32} className="text-accent" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">Crea un account</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Hai già un account?{' '}
            <Link href="/login" className="text-accent hover:text-accent-hover transition-colors">
              Accedi
            </Link>
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border
                bg-card text-foreground placeholder:text-foreground-muted/60
                focus:outline-none focus:border-accent transition-colors"
              placeholder="nomeutente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border
                bg-card text-foreground placeholder:text-foreground-muted/60
                focus:outline-none focus:border-accent transition-colors"
              placeholder="tua@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border
                bg-card text-foreground placeholder:text-foreground-muted/60
                focus:outline-none focus:border-accent transition-colors"
              placeholder="Minimo 8 caratteri"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
              {state.error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={pending}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              bg-accent text-white rounded-lg hover:bg-accent-hover
              disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            Crea account
          </motion.button>

          <p className="text-xs text-foreground-muted text-center">
            Registrandoti accetti i termini di utilizzo del servizio.
          </p>
        </form>
      </motion.div>
    </div>
  )
}
