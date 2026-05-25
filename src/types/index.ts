export interface Author {
  id: number
  name: string
  slug: string
  description: string
  avatarUrl: string | null
  link: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  count: number
  parentId: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  description: string
  count: number
}

export interface FeaturedImage {
  url: string
  alt: string
  width: number
  height: number
  caption: string
}

export interface Post {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  modifiedDate: string
  author: Author
  categories: Category[]
  tags: Tag[]
  featuredImage: FeaturedImage | null
  readingTime: number
  isSticky: boolean
  commentCount: number
  link: string
}

export interface Comment {
  id: number
  postId: number
  parentId: number
  authorName: string
  authorEmail: string
  authorAvatarUrl: string
  date: string
  content: string
  status: 'approved' | 'hold' | 'spam'
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  totalPages: number
  currentPage: number
  perPage: number
}

export interface PostQuery {
  page?: number
  perPage?: number
  categoryId?: number
  tagId?: number
  authorId?: number
  search?: string
  sticky?: boolean
  relatedPostId?: number
}

export interface Page {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  date: string
  modifiedDate: string
  featuredImage: FeaturedImage | null
  link: string
}

export interface MenuItem {
  id: number
  label: string
  url: string
  target: '_blank' | ''
  parentId: number
  order: number
  children: MenuItem[]
}

export interface User {
  id: number
  name: string
  email: string
  avatarUrl: string
}

export interface UserList {
  id: string
  name: string
  isDefault: boolean
  isPublic: boolean
  postIds: number[]
  createdAt: string
}
