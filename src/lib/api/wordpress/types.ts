/** Raw shapes returned by the WP REST API */

export interface WpUser {
  id: number
  name: string
  slug: string
  description: string
  link: string
  avatar_urls: Record<string, string>
  bookmarked_posts?: Record<string, string>
}

export interface WpCategory {
  id: number
  name: string
  slug: string
  description: string
  count: number
  parent: number
}

export interface WpTag {
  id: number
  name: string
  slug: string
  description: string
  count: number
}

export interface WpMediaDetails {
  width: number
  height: number
  sizes: Record<string, { source_url: string; width: number; height: number }>
}

export interface WpMedia {
  id: number
  alt_text: string
  caption: { rendered: string }
  media_details: WpMediaDetails
  source_url: string
}

export interface WpPost {
  id: number
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  modified: string
  sticky: boolean
  comment_status: 'open' | 'closed'
  comments_number?: number
  link: string
  author: number
  categories: number[]
  tags: number[]
  featured_media: number
  _embedded?: {
    author?: WpUser[]
    'wp:term'?: (WpCategory[] | WpTag[])[]
    'wp:featuredmedia'?: WpMedia[]
  }
  acf?: Record<string, unknown>
}

export interface WpPage {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  date: string
  modified: string
  link: string
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: WpMedia[]
  }
}

export interface WpComment {
  id: number
  post: number
  parent: number
  author_name: string
  author_email: string
  author_avatar_urls: Record<string, string>
  date: string
  content: { rendered: string }
  status: 'approved' | 'hold' | 'spam'
}

export interface WpMenu {
  id: number
  slug: string
  name: string
}

export interface WpMenuItem {
  id: number
  title: string
  url: string
  target: string
  parent: number
  order: number
}

export interface WpJwtResponse {
  token: string
  user_email: string
  user_nicename: string
  user_display_name: string
}
