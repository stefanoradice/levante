'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'

interface CommentFormProps {
  postId: number
  parentId?: number
  onCancel?: () => void
  onSuccess?: () => void
}

export function CommentForm({ postId, parentId, onCancel, onSuccess }: CommentFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, parentId, authorName: name, authorEmail: email, content }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? 'Errore durante l\'invio.')
      }

      setSuccess(true)
      setName('')
      setEmail('')
      setContent('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-accent-subtle text-accent text-sm font-medium"
      >
        Commento inviato! Sarà visibile dopo l&apos;approvazione.
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {parentId && (
        <div className="flex items-center justify-between text-sm text-foreground-muted">
          <span>Stai rispondendo a un commento</span>
          <button type="button" onClick={onCancel} className="hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-foreground-muted mb-1.5">
            Nome *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-border
              bg-card text-foreground placeholder:text-foreground-muted/60
              focus:outline-none focus:border-accent transition-colors"
            placeholder="Il tuo nome"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground-muted mb-1.5">
            Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-border
              bg-card text-foreground placeholder:text-foreground-muted/60
              focus:outline-none focus:border-accent transition-colors"
            placeholder="La tua email (non sarà pubblicata)"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground-muted mb-1.5">
          Commento *
        </label>
        <textarea
          required
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-border
            bg-card text-foreground placeholder:text-foreground-muted/60
            focus:outline-none focus:border-accent transition-colors resize-none"
          placeholder="Scrivi il tuo commento..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium
            bg-accent text-white rounded-lg hover:bg-accent-hover
            disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Pubblica commento
        </motion.button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            Annulla
          </button>
        )}
      </div>
    </form>
  )
}
