import type {
  WpPost,
  WpPage,
  WpUser,
  WpCategory,
  WpTag,
  WpMedia,
  WpComment,
  WpMenuItem,
} from './types'
import type {
  Post,
  Page,
  Author,
  Category,
  Tag,
  FeaturedImage,
  Comment,
  MenuItem,
} from '@/types'

const WP_SITEURL = process.env.WP_SITEURL ?? ''
const WP_INTERNAL = process.env.WP_INTERNAL_URL ?? process.env.NEXT_PUBLIC_WP_URL ?? ''

function toInternalUrl(url: string): string {
  if (!WP_SITEURL || !WP_INTERNAL || WP_SITEURL === WP_INTERNAL) return url
  return url.startsWith(WP_SITEURL) ? WP_INTERNAL + url.slice(WP_SITEURL.length) : url
}

// Strips WP origin → relative path for use in Next.js <Link>
// External URLs (different domain) are returned unchanged
function toFrontendPath(url: string): string {
  for (const base of [WP_SITEURL, WP_INTERNAL]) {
    if (base && url.startsWith(base)) return url.slice(base.length) || '/'
  }
  return url
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

function estimateReadingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function mapAuthor(wp: WpUser): Author {
  const avatarUrl =
    wp.avatar_urls?.['96'] ?? wp.avatar_urls?.['48'] ?? null
  return {
    id: wp.id,
    name: wp.name,
    slug: wp.slug,
    description: stripHtml(wp.description ?? ''),
    avatarUrl,
    link: wp.link,
  }
}

export function mapCategory(wp: WpCategory): Category {
  return {
    id: wp.id,
    name: wp.name,
    slug: wp.slug,
    description: stripHtml(wp.description ?? ''),
    count: wp.count,
    parentId: wp.parent,
  }
}

export function mapTag(wp: WpTag): Tag {
  return {
    id: wp.id,
    name: wp.name,
    slug: wp.slug,
    description: stripHtml(wp.description ?? ''),
    count: wp.count,
  }
}

export function mapFeaturedImage(wp: WpMedia): FeaturedImage {
  const large = wp.media_details?.sizes?.large
  return {
    url: toInternalUrl(large?.source_url ?? wp.source_url),
    alt: wp.alt_text ?? '',
    width: large?.width ?? wp.media_details?.width ?? 1200,
    height: large?.height ?? wp.media_details?.height ?? 630,
    caption: stripHtml(wp.caption?.rendered ?? ''),
  }
}

export function mapPost(wp: WpPost): Post {
  const embedded = wp._embedded

  const author = embedded?.author?.[0]
    ? mapAuthor(embedded.author[0])
    : { id: wp.author, name: 'Unknown', slug: '', description: '', avatarUrl: null, link: '' }

  const terms = embedded?.['wp:term'] ?? []
  const categories = (terms[0] ?? []).map((t) => mapCategory(t as WpCategory))
  const tags = (terms[1] ?? []).map((t) => mapTag(t as WpTag))

  const featuredMedia = embedded?.['wp:featuredmedia']?.[0]
  const featuredImage = featuredMedia ? mapFeaturedImage(featuredMedia) : null

  return {
    id: wp.id,
    slug: wp.slug,
    title: stripHtml(wp.title.rendered),
    excerpt: stripHtml(wp.excerpt.rendered),
    content: wp.content.rendered,
    date: wp.date,
    modifiedDate: wp.modified,
    author,
    categories,
    tags,
    featuredImage,
    readingTime: estimateReadingTime(wp.content.rendered),
    isSticky: wp.sticky,
    commentCount: wp.comments_number ?? 0,
    link: wp.link,
  }
}

export function mapPage(wp: WpPage): Page {
  const featuredMedia = wp._embedded?.['wp:featuredmedia']?.[0]
  return {
    id: wp.id,
    slug: wp.slug,
    title: wp.title.rendered,
    content: wp.content.rendered,
    excerpt: wp.excerpt.rendered,
    date: wp.date,
    modifiedDate: wp.modified,
    featuredImage: featuredMedia ? mapFeaturedImage(featuredMedia) : null,
    link: wp.link,
  }
}

export function mapMenuItems(wpItems: WpMenuItem[]): MenuItem[] {
  const flat: MenuItem[] = wpItems.map((wp) => ({
    id: wp.id,
    label: wp.title,
    url: toFrontendPath(wp.url),
    target: wp.target === '_blank' ? '_blank' : '',
    parentId: wp.parent,
    order: wp.order,
    children: [],
  }))

  const map = new Map(flat.map((item) => [item.id, item]))
  const roots: MenuItem[] = []
  for (const item of flat) {
    if (item.parentId === 0) {
      roots.push(item)
    } else {
      map.get(item.parentId)?.children.push(item)
    }
  }
  return roots
}

export function mapComment(wp: WpComment): Comment {
  return {
    id: wp.id,
    postId: wp.post,
    parentId: wp.parent,
    authorName: wp.author_name,
    authorEmail: wp.author_email,
    authorAvatarUrl:
      wp.author_avatar_urls?.['48'] ?? wp.author_avatar_urls?.['96'] ?? '',
    date: wp.date,
    content: wp.content.rendered,
    status: wp.status,
  }
}
