'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { UserList } from '@/types'

interface ListsContextValue {
  lists: UserList[] | null
  loading: boolean
  reload: () => void
  setLists: React.Dispatch<React.SetStateAction<UserList[] | null>>
}

const ListsContext = createContext<ListsContextValue>({
  lists: null,
  loading: false,
  reload: () => {},
  setLists: () => {},
})

export function ListsProvider({
  isLoggedIn,
  children,
}: {
  isLoggedIn: boolean
  children: React.ReactNode
}) {
  const [lists, setLists] = useState<UserList[] | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!isLoggedIn) return
    setLoading(true)
    try {
      const res = await fetch('/api/lists')
      if (res.ok) setLists(await res.json())
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  useEffect(() => { load() }, [load])

  return (
    <ListsContext.Provider value={{ lists, loading, reload: load, setLists }}>
      {children}
    </ListsContext.Provider>
  )
}

export function useLists() {
  return useContext(ListsContext)
}
