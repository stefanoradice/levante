'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, User } from 'lucide-react'
import type { Post } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { SaveToListButton } from './SaveToListButton'
import { formatDateShort } from '@/lib/utils'
import { BookmarkButton } from './BookmarkButton'

interface PostCardProps {
  post: Post
  priority?: boolean
}

export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col rounded-xl overflow-hidden border border-card-border
        bg-card hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5
        transition-shadow duration-300"
    >
      {post.featuredImage && (
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden aspect-video">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            width={post.featuredImage.width}
            height={post.featuredImage.height}
            priority={priority}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1 p-5">
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.categories.slice(0, 2).map((cat) => (
              <Link key={cat.id} href={`/blog?categoria=${cat.slug}`}>
                <Badge variant="accent">{cat.name}</Badge>
              </Link>
            ))}
          </div>
        )}

        <Link href={`/blog/${post.slug}`} className="flex-1">
          <h2 className="font-display font-semibold text-lg text-foreground
            group-hover:text-accent transition-colors duration-200 line-clamp-2 mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-foreground-muted line-clamp-3">{post.excerpt}</p>
        </Link>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-foreground-muted">
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{formatDateShort(post.date)}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime} min
            </span>
            <SaveToListButton postId={post.id} compact />
            <BookmarkButton postId={post.id} />
          </div>
        </div>
      </div>
    </motion.article>
  )
}
