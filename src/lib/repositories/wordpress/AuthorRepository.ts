import { unstable_cache } from 'next/cache'
import type { IAuthorRepository } from '../interfaces'
import type { Author, Post, PaginatedResult, PostQuery } from '@/types'
import { fetchUserBySlug, fetchPosts } from '@/lib/api/wordpress/client'
import { mapAuthor, mapPost } from '@/lib/api/wordpress/mappers'

const REVALIDATE = 300

const cachedGetAuthorBySlug = unstable_cache(
  async (slug: string): Promise<Author | null> => {
    const wp = await fetchUserBySlug(slug)
    return wp ? mapAuthor(wp) : null
  },
  ['author-by-slug'],
  { tags: ['authors'], revalidate: 3600 },
)

const cachedGetPostsByAuthor = unstable_cache(
  async (authorId: number, query: PostQuery): Promise<PaginatedResult<Post>> => {
    const { posts, total, totalPages } = await fetchPosts({
      authorId,
      page: query.page ?? 1,
      perPage: query.perPage ?? 10,
    })
    return {
      items: posts.map(mapPost),
      total,
      totalPages,
      currentPage: query.page ?? 1,
      perPage: query.perPage ?? 10,
    }
  },
  ['author-posts'],
  { tags: ['posts'], revalidate: REVALIDATE },
)

export class WordPressAuthorRepository implements IAuthorRepository {
  getAuthorBySlug(slug: string) { return cachedGetAuthorBySlug(slug) }
  getPostsByAuthor(authorId: number, query: PostQuery) {
    return cachedGetPostsByAuthor(authorId, query)
  }
}
