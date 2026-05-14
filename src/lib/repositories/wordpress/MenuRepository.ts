import { unstable_cache } from 'next/cache'
import type { IMenuRepository } from '../interfaces'
import type { MenuItem } from '@/types'
import { fetchMenuBySlug } from '@/lib/api/wordpress/client'
import { mapMenuItems } from '@/lib/api/wordpress/mappers'

const cachedGetMenuBySlug = unstable_cache(
  async (slug: string): Promise<MenuItem[]> => {
    const items = await fetchMenuBySlug(slug)
    return mapMenuItems(items)
  },
  ['menu-by-slug'],
  { tags: ['menus'], revalidate: 3600 },
)

export class WordPressMenuRepository implements IMenuRepository {
  getMenuBySlug(slug: string) { return cachedGetMenuBySlug(slug) }
}
