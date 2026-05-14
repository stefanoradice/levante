'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Bookmark, Globe, Lock, Trash2, Pencil, Check, X } from 'lucide-react'
import type { UserList } from '@/types'
import { deleteListAction, updateListAction } from '@/lib/auth/list-actions'

export function ListCard({ list }: { list: UserList }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(list.name)
  const [isPublic, setIsPublic] = useState(list.isPublic)
  const [pending, startTransition] = useTransition()

  function saveEdit() {
    startTransition(async () => {
      await updateListAction(list.id, { name, isPublic })
      setEditing(false)
    })
  }

  function handleDelete() {
    if (!confirm(`Eliminare la lista "${list.name}"?`)) return
    startTransition(async () => { await deleteListAction(list.id) })
  }

  return (
    <div className="p-5 rounded-xl border border-card-border bg-card flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Bookmark size={18} className="text-accent mt-0.5 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2 py-1 text-sm rounded border border-accent bg-background
                text-foreground focus:outline-none"
              autoFocus
            />
          ) : (
            <Link
              href={`/dashboard/liste/${list.id}`}
              className="font-medium text-foreground truncate hover:text-accent transition-colors"
            >
              {list.name}
            </Link>
          )}
          <p className="text-xs text-foreground-muted mt-0.5">
            {list.postIds.length} {list.postIds.length === 1 ? 'articolo' : 'articoli'}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {editing ? (
            <>
              {/* Toggle public/private */}
              <button
                onClick={() => setIsPublic((v) => !v)}
                className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors text-foreground-muted"
                title={isPublic ? 'Rendi privata' : 'Rendi pubblica'}
              >
                {isPublic ? <Globe size={14} className="text-accent" /> : <Lock size={14} />}
              </button>
              <button onClick={saveEdit} disabled={pending}
                className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors text-accent">
                <Check size={14} />
              </button>
              <button onClick={() => { setEditing(false); setName(list.name); setIsPublic(list.isPublic) }}
                className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors text-foreground-muted">
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              {isPublic
                ? <Globe size={13} className="text-foreground-muted" />
                : <Lock size={13} className="text-foreground-muted" />
              }
              <button onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors text-foreground-muted">
                <Pencil size={13} />
              </button>
              {!list.isDefault && (
                <button onClick={handleDelete} disabled={pending}
                  className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors text-foreground-muted hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {list.isDefault && (
        <span className="text-xs text-foreground-muted bg-background-secondary px-2 py-0.5 rounded-full w-fit">
          Lista predefinita
        </span>
      )}
    </div>
  )
}
