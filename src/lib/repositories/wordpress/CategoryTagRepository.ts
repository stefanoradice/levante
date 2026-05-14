import { unstable_cache } from 'next/cache'
import type { ICategoryRepository, ITagRepository } from '../interfaces'
import type { Category, Tag } from '@/types'
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchTags,
  fetchTagBySlug,
} from '@/lib/api/wordpress/client'
import { mapCategory, mapTag } from '@/lib/api/wordpress/mappers'

const REVALIDATE = 3600 // 1 hour — taxonomy changes rarely

const cachedGetCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const cats = await fetchCategories()
    return cats.map(mapCategory)
  },
  ['categories'],
  { tags: ['categories'], revalidate: REVALIDATE },
)

const cachedGetCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category | null> => {
    const wp = await fetchCategoryBySlug(slug)
    return wp ? mapCategory(wp) : null
  },
  ['category-by-slug'],
  { tags: ['categories'], revalidate: REVALIDATE },
)

const cachedGetTags = unstable_cache(
  async (): Promise<Tag[]> => {
    const tags = await fetchTags()
    return tags.map(mapTag)
  },
  ['tags'],
  { tags: ['tags'], revalidate: REVALIDATE },
)

const cachedGetTagBySlug = unstable_cache(
  async (slug: string): Promise<Tag | null> => {
    const wp = await fetchTagBySlug(slug)
    return wp ? mapTag(wp) : null
  },
  ['tag-by-slug'],
  { tags: ['tags'], revalidate: REVALIDATE },
)

export class WordPressCategoryRepository implements ICategoryRepository {
  getCategories() { return cachedGetCategories() }
  getCategoryBySlug(slug: string) { return cachedGetCategoryBySlug(slug) }
}

export class WordPressTagRepository implements ITagRepository {
  getTags() { return cachedGetTags() }
  getTagBySlug(slug: string) { return cachedGetTagBySlug(slug) }
}
