'use client'

import React, { createContext, useState, useEffect, useCallback } from 'react'

interface BookmarksContextValue {
  bookmarks: number[] | null
  loading: boolean
  reload: () => void
  setBookmarks: React.Dispatch<React.SetStateAction<number[] | null>>
}

const BookmarksContext = createContext<BookmarksContextValue>({
  bookmarks: null,
  loading: false,
  reload: () => {},
  setBookmarks: () => {},
})

export function BookmarksProvider({isLoggedIn, children}: { isLoggedIn: boolean; children: React.ReactNode }) {

    const [bookmarks, setBookmarks] = useState<number[] | null>(null)
    const [loading, setLoading] = useState(false)

    const load = useCallback(async () => {
        if (!isLoggedIn) return
        setLoading(true)
        try {
            const res = await fetch('/api/bookmarks')
            if (res.ok) setBookmarks(await res.json())
        } finally {
            setLoading(false)
        }
    }, [isLoggedIn])

    useEffect(() => { load() }, [load])

    return (
        <BookmarksContext.Provider value={{ bookmarks, loading, reload: load, setBookmarks }}>
            {children}
        </BookmarksContext.Provider>
    )
}

export function useBookmarks() {
    return React.useContext(BookmarksContext)
}