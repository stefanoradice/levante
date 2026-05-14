import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Post } from '@/types'
import { getPostRepository } from '@/lib/repositories/factory'
import { HeroSlider } from '@/components/home/HeroSlider'
import { PostCard } from '@/components/blog/PostCard'
import { BackendError } from '@/components/ui/BackendError'

async function FeaturedSlider() {
  try {
    const repo = getPostRepository()
    const featured = await repo.getFeaturedPosts()
    return <HeroSlider posts={featured} />
  } catch {
    return <BackendError inline />
  }
}

async function RecentPosts() {
  let items: Post[] = []
  try {
    const repo = getPostRepository()
    ;({ items } = await repo.getPosts({ perPage: 6 }))
  } catch {
    return <BackendError inline />
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-bold text-2xl text-foreground">
          Articoli recenti
        </h2>
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover
            font-medium transition-colors duration-200"
        >
          Vedi tutti <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((post, i) => (
          <PostCard key={post.id} post={post} priority={i < 3} />
        ))}
      </div>
    </section>
  )
}

function SliderSkeleton() {
  return (
    <div
      className="w-full rounded-2xl bg-background-secondary animate-pulse"
      style={{ minHeight: '480px' }}
    />
  )
}

function PostsSkeleton() {
  return (
    <section>
      <div className="h-8 w-48 bg-background-secondary rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-card-border bg-card overflow-hidden">
            <div className="aspect-video bg-background-secondary animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-20 bg-background-secondary rounded animate-pulse" />
              <div className="h-5 bg-background-secondary rounded animate-pulse" />
              <div className="h-4 bg-background-secondary rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-16">
      <Suspense fallback={<SliderSkeleton />}>
        <FeaturedSlider />
      </Suspense>

      <Suspense fallback={<PostsSkeleton />}>
        <RecentPosts />
      </Suspense>
    </div>
  )
}
