'use client'

import { useState, useActionState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { createListAction } from '@/lib/auth/list-actions'

export function CreateListForm() {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(createListAction, null)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
          text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition-colors"
      >
        <Plus size={14} /> Nuova lista
      </button>
    )
  }

  return (
    <form
      action={async (fd) => {
        await action(fd)
        if (!state?.error) setOpen(false)
      }}
      className="flex items-center gap-2"
    >
      <input
        name="name"
        type="text"
        required
        autoFocus
        placeholder="Nome lista"
        className="px-3 py-1.5 text-sm rounded-lg border border-border bg-card
          text-foreground focus:outline-none focus:border-accent transition-colors w-40"
      />
      <label className="flex items-center gap-1.5 text-xs text-foreground-muted cursor-pointer">
        <input type="checkbox" name="isPublic" value="true" className="rounded" />
        Pubblica
      </label>
      <button type="submit" disabled={pending}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium
          bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-60 transition-colors">
        {pending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
        Crea
      </button>
      <button type="button" onClick={() => setOpen(false)}
        className="p-1.5 text-foreground-muted hover:text-foreground transition-colors">
        <X size={16} />
      </button>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
    </form>
  )
}
