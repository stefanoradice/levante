import { unstable_cache } from 'next/cache'
import type { IPageRepository } from '../interfaces'
import type { Page } from '@/types'
import { fetchPageBySlug } from '@/lib/api/wordpress/client'
import { mapPage } from '@/lib/api/wordpress/mappers'

const cachedGetPageBySlug = unstable_cache(
  async (slug: string): Promise<Page | null> => {
    const wp = await fetchPageBySlug(slug)
    return wp ? mapPage(wp) : null
  },
  ['page-by-slug'],
  { tags: ['pages'], revalidate: 3600 },
)

export class WordPressPageRepository implements IPageRepository {
  getPageBySlug(slug: string) { return cachedGetPageBySlug(slug) }
}
