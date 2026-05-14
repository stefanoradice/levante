import type {
  Post,
  Page,
  Author,
  Category,
  Tag,
  Comment,
  MenuItem,
  UserList,
  PaginatedResult,
  PostQuery,
} from '@/types'

export interface IPostRepository {
  getPosts(query: PostQuery): Promise<PaginatedResult<Post>>
  getPostBySlug(slug: string): Promise<Post | null>
  getFeaturedPosts(): Promise<Post[]>
  getPostsByIds(ids: number[]): Promise<Post[]>
}

export interface IAuthorRepository {
  getAuthorBySlug(slug: string): Promise<Author | null>
  getPostsByAuthor(
    authorId: number,
    query: PostQuery,
  ): Promise<PaginatedResult<Post>>
}

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>
  getCategoryBySlug(slug: string): Promise<Category | null>
}

export interface ITagRepository {
  getTags(): Promise<Tag[]>
  getTagBySlug(slug: string): Promise<Tag | null>
}

export interface ICommentRepository {
  getComments(postId: number): Promise<Comment[]>
  submitComment(data: {
    postId: number
    parentId?: number
    authorName: string
    authorEmail: string
    content: string
    token?: string
  }): Promise<Comment>
}

export interface IPageRepository {
  getPageBySlug(slug: string): Promise<Page | null>
}

export interface IMenuRepository {
  getMenuBySlug(slug: string): Promise<MenuItem[]>
}

export interface IUserDataRepository {
  getLists(token: string): Promise<UserList[]>
  createList(token: string, data: { name: string; isPublic?: boolean }): Promise<UserList>
  updateList(token: string, listId: string, data: { name?: string; isPublic?: boolean }): Promise<UserList>
  deleteList(token: string, listId: string): Promise<void>
  addToList(token: string, listId: string, postId: number): Promise<UserList>
  removeFromList(token: string, listId: string, postId: number): Promise<UserList>
  getBookmarks(token: string): Promise<number[]>
  toggleBookmark(token: string, postId: number, add: boolean): Promise<void>
}
