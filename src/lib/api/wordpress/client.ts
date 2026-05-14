import type {
  WpPost,
  WpPage,
  WpUser,
  WpCategory,
  WpTag,
  WpComment,
  WpMenuItem,
  WpJwtResponse,
} from './types'
import type { UserList } from '@/types'

const WP_URL = process.env.NEXT_PUBLIC_WP_URL ?? 'http://localhost:8080'
const API_BASE = `${WP_URL}/wp-json/wp/v2`
const JWT_BASE = `${WP_URL}/wp-json/jwt-auth/v1`

export class WpApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'WpApiError'
  }
}

export class WpConnectionError extends Error {
  constructor(message = 'Backend WordPress non raggiungibile') {
    super(message)
    this.name = 'WpConnectionError'
  }
}

async function wpFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw new WpConnectionError()
  }

  if (!res.ok) {
    throw new WpApiError(res.status, `WP API error ${res.status}: ${path}`)
  }

  return res.json() as Promise<T>
}

export async function fetchPosts(params: {
  page?: number
  perPage?: number
  categoryId?: number
  tagId?: number
  authorId?: number
  search?: string
  sticky?: boolean
}): Promise<{ posts: WpPost[]; total: number; totalPages: number }> {
  const qs = new URLSearchParams()
  qs.set('_embed', '1')
  qs.set('page', String(params.page ?? 1))
  qs.set('per_page', String(params.perPage ?? 10))
  if (params.categoryId) qs.set('categories', String(params.categoryId))
  if (params.tagId) qs.set('tags', String(params.tagId))
  if (params.authorId) qs.set('author', String(params.authorId))
  if (params.search) qs.set('search', params.search)
  if (params.sticky === true) qs.set('sticky', '1')

  let res: Response
  try {
    res = await fetch(`${API_BASE}/posts?${qs}`, { cache: 'no-store' })
  } catch {
    throw new WpConnectionError()
  }

  if (!res.ok) {
    throw new WpApiError(res.status, `WP API error ${res.status}: /posts`)
  }

  const posts = (await res.json()) as WpPost[]
  const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10)
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10)

  return { posts, total, totalPages }
}

export async function fetchPostBySlug(slug: string): Promise<WpPost | null> {
  const posts = await wpFetch<WpPost[]>(
    `/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
    { cache: 'no-store' },
  )
  return posts[0] ?? null
}

export async function fetchPostsByIds(ids: number[]): Promise<WpPost[]> {
  if (ids.length === 0) return []
  return wpFetch<WpPost[]>(`/posts?include=${ids.join(',')}&per_page=${ids.length}&_embed=1`, { cache: 'no-store' })
}

export async function fetchUser(id: number): Promise<WpUser> {
  return wpFetch<WpUser>(`/users/${id}`)
}

export async function fetchUserBySlug(slug: string): Promise<WpUser | null> {
  const users = await wpFetch<WpUser[]>(`/users?slug=${encodeURIComponent(slug)}`)
  return users[0] ?? null
}

export async function fetchCategories(): Promise<WpCategory[]> {
  return wpFetch<WpCategory[]>('/categories?per_page=100&orderby=count&order=desc')
}

export async function fetchCategoryBySlug(slug: string): Promise<WpCategory | null> {
  const cats = await wpFetch<WpCategory[]>(
    `/categories?slug=${encodeURIComponent(slug)}`,
  )
  return cats[0] ?? null
}

export async function fetchTags(): Promise<WpTag[]> {
  return wpFetch<WpTag[]>('/tags?per_page=100&orderby=count&order=desc')
}

export async function fetchTagBySlug(slug: string): Promise<WpTag | null> {
  const tags = await wpFetch<WpTag[]>(`/tags?slug=${encodeURIComponent(slug)}`)
  return tags[0] ?? null
}

export async function fetchComments(postId: number): Promise<WpComment[]> {
  return wpFetch<WpComment[]>(
    `/comments?post=${postId}&per_page=100&order=asc`,
    { cache: 'no-store' },
  )
}

export async function submitComment(data: {
  postId: number
  parentId?: number
  authorName: string
  authorEmail: string
  content: string
  token?: string
}): Promise<WpComment> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (data.token) headers['Authorization'] = `Bearer ${data.token}`

  const res = await fetch(`${API_BASE}/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      post: data.postId,
      parent: data.parentId ?? 0,
      author_name: data.authorName,
      author_email: data.authorEmail,
      content: data.content,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new WpApiError(res.status, (err as { message?: string }).message ?? 'Comment submission failed')
  }

  return res.json() as Promise<WpComment>
}

export async function fetchPageBySlug(slug: string): Promise<WpPage | null> {
  const pages = await wpFetch<WpPage[]>(
    `/pages?slug=${encodeURIComponent(slug)}&_embed=1`,
    { cache: 'no-store' },
  )
  return pages[0] ?? null
}

export async function fetchCurrentUser(token: string): Promise<WpUser> {
  return wpFetch<WpUser>('/users/me?context=edit', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
}

export async function fetchRegister(data: {
  username: string
  email: string
  password: string
}): Promise<{ id: number; username: string; email: string }> {
  let res: Response
  try {
    res = await fetch(`${WP_URL}/wp-json/headless/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {
    throw new WpConnectionError()
  }
  const json = await res.json()
  if (!res.ok) {
    throw new WpApiError(res.status, (json as { message?: string }).message ?? 'Registrazione fallita.')
  }
  return json as { id: number; username: string; email: string }
}

async function headlessFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${WP_URL}/wp-json/headless/v1${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
      cache: 'no-store',
    })
  } catch {
    throw new WpConnectionError()
  }
  const json = await res.json()
  if (!res.ok) throw new WpApiError(res.status, (json as { message?: string }).message ?? 'API error')
  return json as T
}

export async function fetchLists(token: string): Promise<UserList[]> {
  return headlessFetch<UserList[]>('/lists', token)
}
export async function fetchCreateList(token: string, data: { name: string; isPublic?: boolean }): Promise<UserList> {
  return headlessFetch<UserList>('/lists', token, { method: 'POST', body: JSON.stringify(data) })
}
export async function fetchUpdateList(token: string, id: string, data: { name?: string; isPublic?: boolean }): Promise<UserList> {
  return headlessFetch<UserList>(`/lists/${id}`, token, { method: 'PUT', body: JSON.stringify(data) })
}
export async function fetchDeleteList(token: string, id: string): Promise<void> {
  await headlessFetch<unknown>(`/lists/${id}`, token, { method: 'DELETE' })
}
export async function fetchAddToList(token: string, listId: string, postId: number): Promise<UserList> {
  return headlessFetch<UserList>(`/lists/${listId}/items`, token, { method: 'POST', body: JSON.stringify({ postId }) })
}
export async function fetchRemoveFromList(token: string, listId: string, postId: number): Promise<UserList> {
  return headlessFetch<UserList>(`/lists/${listId}/items/${postId}`, token, { method: 'DELETE' })
}

export async function fetchMenuBySlug(slug: string): Promise<WpMenuItem[]> {
  let res: Response
  try {
    res = await fetch(`${WP_URL}/wp-json/headless/v1/menu/${encodeURIComponent(slug)}`, { cache: 'no-store' })
  } catch {
    throw new WpConnectionError()
  }
  if (!res.ok) return []
  return res.json() as Promise<WpMenuItem[]>
}

export async function jwtLogin(
  username: string,
  password: string,
): Promise<WpJwtResponse> {
  const res = await fetch(`${JWT_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new WpApiError(
      res.status,
      (err as { message?: string }).message ?? 'Login failed',
    )
  }

  return res.json() as Promise<WpJwtResponse>
}

export async function jwtValidate(token: string): Promise<boolean> {
  const res = await fetch(`${JWT_BASE}/token/validate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.ok
}

export async function fetchBookmarkedPosts(token: string): Promise<number[]> {
  const res = await fetchCurrentUser(token)
  return res.bookmarked_posts ? Object.keys(res.bookmarked_posts ?? {}).map(Number) : []
}

export async function fetchToggleBookmark(token: string, postId: number, add: boolean): Promise<void> {
  const res = await fetch(`${WP_URL}/wp-json/headless/v1/posts/${postId}/bookmark`, {
    method: add ? 'POST' : 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {  
    const err = await res.json().catch(() => ({}))
    throw new WpApiError(
      res.status,
      (err as { message?: string }).message ?? 'Bookmark toggle failed',
    )
  }
} 
