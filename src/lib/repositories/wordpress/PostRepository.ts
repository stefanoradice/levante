import { unstable_cache } from 'next/cache'
import type { IPostRepository } from '../interfaces'
import type { Post, PaginatedResult, PostQuery } from '@/types'
import { fetchPosts, fetchPostBySlug, fetchPostsByIds } from '@/lib/api/wordpress/client'
import { mapPost } from '@/lib/api/wordpress/mappers'

const REVALIDATE = 300 // 5 minutes

const cachedGetPosts = unstable_cache(
  async (query: PostQuery): Promise<PaginatedResult<Post>> => {
    const { posts, total, totalPages } = await fetchPosts({
      page: query.page ?? 1,
      perPage: query.perPage ?? 10,
      categoryId: query.categoryId,
      tagId: query.tagId,
      authorId: query.authorId,
      search: query.search,
    })
    return {
      items: posts.map(mapPost),
      total,
      totalPages,
      currentPage: query.page ?? 1,
      perPage: query.perPage ?? 10,
    }
  },
  ['posts'],
  { tags: ['posts'], revalidate: REVALIDATE },
)

const cachedGetPostBySlug = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    const wp = await fetchPostBySlug(slug)
    return wp ? mapPost(wp) : null
  },
  ['post-by-slug'],
  { tags: ['posts'], revalidate: REVALIDATE },
)

const cachedGetFeaturedPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const { posts } = await fetchPosts({ sticky: true, perPage: 8 })
    return posts.map(mapPost)
  },
  ['featured-posts'],
  { tags: ['posts', 'featured-posts'], revalidate: REVALIDATE },
)

export class WordPressPostRepository implements IPostRepository {
  getPosts(query: PostQuery) { return cachedGetPosts(query) }
  getPostBySlug(slug: string) { return cachedGetPostBySlug(slug) }
  getFeaturedPosts() { return cachedGetFeaturedPosts() }
  async getPostsByIds(ids: number[]): Promise<Post[]> {
    if (ids.length === 0) return []
    const posts = await fetchPostsByIds(ids)
    return posts.map(mapPost)
  }
}
