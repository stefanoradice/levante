'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { Post } from '@/types'
import { PostCard } from './PostCard'

interface InfinitePostListProps {
  initialPosts: Post[]
  initialTotalPages: number
  categoryId?: number
  tagId?: number
  search?: string
}

const PER_PAGE = 9

export function InfinitePostList({
  initialPosts,
  initialTotalPages,
  categoryId,
  tagId,
  search,
}: InfinitePostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [page, setPage] = useState(1)
  const [totalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const hasMore = page < totalPages

  useEffect(() => {
    setPosts(initialPosts)
    setPage(1)
  }, [initialPosts, categoryId, tagId, search])

  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' },
    )

    const el = sentinelRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, page])

  async function loadMore() {
    if (loading || !hasMore) return
    setLoading(true)

    const qs = new URLSearchParams()
    qs.set('page', String(page + 1))
    qs.set('perPage', String(PER_PAGE))
    if (categoryId) qs.set('categoryId', String(categoryId))
    if (tagId) qs.set('tagId', String(tagId))
    if (search) qs.set('search', search)

    try {
      const res = await fetch(`/api/posts?${qs}`)
      if (!res.ok) throw new Error('fetch error')
      const data = await res.json() as { items: Post[] }
      setPosts((prev) => [...prev, ...data.items])
      setPage((p) => p + 1)
    } catch {
      // fail silently — user can scroll again to retry
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i < 9 ? 0 : 0.05 }}
          >
            <PostCard post={post} priority={i < 3} />
          </motion.div>
        ))}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-8">
        {loading && (
          <Loader2 size={24} className="animate-spin text-foreground-muted" />
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-sm text-foreground-muted">Hai letto tutto!</p>
        )}
      </div>
    </>
  )
}
