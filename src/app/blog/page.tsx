import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  getPostRepository,
  getCategoryRepository,
  getTagRepository,
} from '@/lib/repositories/factory'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { InfinitePostList } from '@/components/blog/InfinitePostList'
import { BackendError } from '@/components/ui/BackendError'

interface BlogPageProps {
  searchParams: Promise<{ categoria?: string; tag?: string; cerca?: string }>
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { categoria, tag } = await searchParams
  const suffix = categoria ?? tag ?? null
  return {
    title: suffix ? `Blog — ${suffix}` : 'Blog',
    description: 'Tutti gli articoli del blog.',
  }
}

const PER_PAGE = 9

async function BlogContent({ searchParams }: BlogPageProps) {
  const { categoria, tag, cerca } = await searchParams

  const [catRepo, tagRepo] = [getCategoryRepository(), getTagRepository()]
  let categories: Awaited<ReturnType<typeof catRepo.getCategories>> = []
  let tags: Awaited<ReturnType<typeof tagRepo.getTags>> = []
  try {
    ;[categories, tags] = await Promise.all([
      catRepo.getCategories(),
      tagRepo.getTags(),
    ])
  } catch {
    return <BackendError inline />
  }

  const activeCat = categoria
    ? categories.find((c) => c.slug === categoria) ?? null
    : null
  const activeTag = tag
    ? tags.find((t) => t.slug === tag) ?? null
    : null

  const repo = getPostRepository()
  let result: Awaited<ReturnType<typeof repo.getPosts>>
  try {
    result = await repo.getPosts({
      perPage: PER_PAGE,
      categoryId: activeCat?.id,
      tagId: activeTag?.id,
      search: cerca,
    })
  } catch {
    return <BackendError inline />
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Sidebar */}
      <div className="lg:w-64 shrink-0">
        <BlogSidebar
          categories={categories}
          tags={tags}
          activeCategorySlug={categoria}
          activeTagSlug={tag}
        />
      </div>

      {/* Posts */}
      <div className="flex-1 min-w-0">
        {activeCat && (
          <h1 className="font-display font-bold text-2xl text-foreground mb-6">
            {activeCat.name}
          </h1>
        )}
        {activeTag && (
          <h1 className="font-display font-bold text-2xl text-foreground mb-6">
            #{activeTag.name}
          </h1>
        )}
        {cerca && (
          <p className="text-foreground-muted text-sm mb-6">
            Risultati per: <strong className="text-foreground">&quot;{cerca}&quot;</strong>
          </p>
        )}

        {result.items.length === 0 ? (
          <p className="text-foreground-muted py-16 text-center">
            Nessun articolo trovato.
          </p>
        ) : (
          <InfinitePostList
            initialPosts={result.items}
            initialTotalPages={result.totalPages}
            categoryId={activeCat?.id}
            tagId={activeTag?.id}
            search={cerca}
          />
        )}
      </div>
    </div>
  )
}

function BlogSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="lg:w-64 shrink-0 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 rounded-lg bg-background-secondary animate-pulse" />
        ))}
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
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
    </div>
  )
}

export default function BlogPage(props: BlogPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent {...props} />
      </Suspense>
    </div>
  )
}
