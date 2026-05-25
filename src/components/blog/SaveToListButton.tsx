'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Bookmark, Plus, Check, Loader2, Lock, Globe, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/layout/AuthContext'
import { useLists } from '@/components/layout/ListsContext'
import { togglePostInListAction } from '@/lib/auth/list-actions'
import type { UserList } from '@/types'

interface SaveToListButtonProps {
  postId: number
  compact?: boolean
}

export function SaveToListButton({ postId, compact = false }: SaveToListButtonProps) {
  const { isLoggedIn } = useAuth()
  const { lists, loading, setLists } = useLists()
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 })
  const [pending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const isSaved = lists ? lists.some((l) => l.postIds.includes(postId)) : false

  function handleOpen() {
    if (!isLoggedIn) { router.push('/login'); return }

    if (!open) {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) {
        setDropdownPos({
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right,
        })
      }
    }
    setOpen((v) => !v)
  }

  function toggle(list: UserList) {
    const add = !list.postIds.includes(postId)
    setLists((prev) =>
      prev?.map((l) =>
        l.id === list.id
          ? { ...l, postIds: add ? [...l.postIds, postId] : l.postIds.filter((id) => id !== postId) }
          : l,
      ) ?? null,
    )
    startTransition(async () => {
      const result = await togglePostInListAction(list.id, postId, add)
      if (result?.error) {
        setLists((prev) =>
          prev?.map((l) =>
            l.id === list.id
              ? { ...l, postIds: add ? l.postIds.filter((id) => id !== postId) : [...l.postIds, postId] }
              : l,
          ) ?? null,
        )
      }
    })
  }

  const dropdown = open && mounted ? (
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: dropdownPos.top, right: dropdownPos.right, zIndex: 9999 }}
      className="w-56 rounded-xl border border-card-border bg-card shadow-lg shadow-black/10 overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-border">
        <p className="text-xs font-medium text-foreground-muted">Salva in una lista</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 size={16} className="animate-spin text-foreground-muted" />
        </div>
      ) : lists === null ? (
        <div className="flex items-center gap-2 px-3 py-3 text-xs text-red-500">
          <AlertCircle size={13} />
          Errore nel caricamento
        </div>
      ) : (
        <ul className="py-1 max-h-52 overflow-y-auto">
          {lists.map((list) => {
            const included = list.postIds.includes(postId)
            return (
              <li key={list.id}>
                <button
                  onClick={() => toggle(list)}
                  disabled={pending}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm
                    hover:bg-background-secondary transition-colors disabled:opacity-60"
                >
                  <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center
                    transition-colors ${included ? 'bg-accent border-accent' : 'border-border'}`}>
                    {included && <Check size={10} className="text-white" />}
                  </span>
                  <span className="flex-1 text-left text-foreground truncate">{list.name}</span>
                  {list.isPublic
                    ? <Globe size={12} className="text-foreground-muted flex-shrink-0" />
                    : <Lock size={12} className="text-foreground-muted flex-shrink-0" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="border-t border-border">
        <button
          onClick={() => { setOpen(false); router.push('/dashboard') }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent
            hover:bg-background-secondary transition-colors"
        >
          <Plus size={14} /> Gestisci liste
        </button>
      </div>
    </div>
  ) : null

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        aria-label="Salva nelle liste"
        className={`flex items-center justify-center rounded-lg transition-colors duration-200
          ${compact ? 'w-8 h-8' : 'w-9 h-9'}
          ${isSaved
            ? 'text-accent'
            : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
          }`}
      >
        <Bookmark size={compact ? 15 : 17} fill={isSaved ? 'currentColor' : 'none'} />
      </button>

      {mounted && dropdown && createPortal(dropdown, document.body)}
    </>
  )
}
