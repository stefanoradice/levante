import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getPageRepository } from '@/lib/repositories/factory'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageRepository().getPageBySlug(slug)
  if (!page) return { title: 'Pagina non trovata' }
  return {
    title: page.title,
    description: page.excerpt.replace(/<[^>]+>/g, '').trim(),
  }
}

export default async function WpPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageRepository().getPageBySlug(slug)
  if (!page) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {page.featuredImage && (
        <div className="relative w-full rounded-xl overflow-hidden mb-10 aspect-video">
          <Image
            src={page.featuredImage.url}
            alt={page.featuredImage.alt || page.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground leading-tight mb-8">
        {page.title}
      </h1>

      <div
        className="prose prose-stone dark:prose-invert max-w-none
          prose-headings:font-display prose-headings:font-semibold
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-code:text-accent"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </article>
  )
}
