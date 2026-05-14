'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react'
import type { Post } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatDateShort } from '@/lib/utils'

interface HeroSliderProps {
  posts: Post[]
}

export function HeroSlider({ posts }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1)
      setCurrent(index)
    },
    [current],
  )

  const next = useCallback(() => go((current + 1) % posts.length), [current, go, posts.length])
  const prev = useCallback(() => go((current - 1 + posts.length) % posts.length), [current, go, posts.length])

  useEffect(() => {
    if (posts.length <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, posts.length])

  if (posts.length === 0) return null

  const post = posts[current]

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-background-secondary"
      style={{ minHeight: '480px' }}>
      {/* Background image */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={post.id}
          custom={direction}
          variants={{
            enter: { opacity: 0 },
            center: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {post.featuredImage ? (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              priority
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent-subtle to-background-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[480px] p-6 sm:p-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={post.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.slice(0, 2).map((cat) => (
                  <Badge key={cat.id} variant="accent">{cat.name}</Badge>
                ))}
              </div>
            )}

            <Link href={`/blog/${post.slug}`}>
              <h2 className="font-display font-bold text-2xl sm:text-4xl text-white
                hover:text-amber-200 transition-colors duration-200 line-clamp-3 mb-3">
                {post.title}
              </h2>
            </Link>

            <p className="text-white/75 text-sm sm:text-base line-clamp-2 mb-4">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {post.author.name}
              </span>
              <span>{formatDateShort(post.date)}</span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime} min
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {posts.length > 1 && (
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={prev}
              className="flex items-center justify-center w-9 h-9 rounded-full
                bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm
                transition-colors duration-200"
              aria-label="Precedente"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1.5">
              {posts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center justify-center w-9 h-9 rounded-full
                bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm
                transition-colors duration-200"
              aria-label="Successivo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
