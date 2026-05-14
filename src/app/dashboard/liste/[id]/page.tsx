import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Globe, Lock, BookMarked } from 'lucide-react'
import { getValidatedSession } from '@/lib/auth/session'
import { getUserDataRepository, getPostRepository } from '@/lib/repositories/factory'
import { PostCard } from '@/components/blog/PostCard'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const session = await getValidatedSession()
  if (!session) return { title: 'Lista', robots: { index: false, follow: false } }
  try {
    const lists = await getUserDataRepository().getLists(session.token)
    const list = lists.find((l) => l.id === id)
    return { title: list?.name ?? 'Lista', robots: { index: false, follow: false } }
  } catch {
    return { title: 'Lista', robots: { index: false, follow: false } }
  }
}

export default async function ListDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getValidatedSession()
  if (!session) redirect('/login')

  const lists = await getUserDataRepository().getLists(session.token).catch(() => null)
  const list = lists?.find((l) => l.id === id)
  if (!list) notFound()

  const posts = await getPostRepository().getPostsByIds(list.postIds).catch(() => [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted
          hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <BookMarked size={22} className="text-accent shrink-0" />
        <h1 className="font-display font-bold text-2xl text-foreground">{list.name}</h1>
        {list.isPublic
          ? <Globe size={15} className="text-foreground-muted" />
          : <Lock size={15} className="text-foreground-muted" />}
      </div>
      <p className="text-sm text-foreground-muted mb-10">
        {list.postIds.length} {list.postIds.length === 1 ? 'articolo' : 'articoli'}
      </p>

      {posts.length === 0 ? (
        <div className="py-20 text-center text-foreground-muted">
          <BookMarked size={40} className="mx-auto mb-4 opacity-30" />
          <p>Nessun articolo in questa lista.</p>
          <Link href="/blog" className="mt-4 inline-block text-sm text-accent hover:underline">
            Sfoglia il blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  )
}
