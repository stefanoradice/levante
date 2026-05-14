import type { IUserDataRepository } from '../interfaces'
import type { UserList } from '@/types'
import {
  fetchLists,
  fetchCreateList,
  fetchUpdateList,
  fetchDeleteList,
  fetchAddToList,
  fetchRemoveFromList,
  fetchBookmarkedPosts,
  fetchToggleBookmark,
} from '@/lib/api/wordpress/client'

export class WordPressUserDataRepository implements IUserDataRepository {
  getLists(token: string): Promise<UserList[]> { return fetchLists(token) }
  createList(token: string, data: { name: string; isPublic?: boolean }): Promise<UserList> { return fetchCreateList(token, data) }
  updateList(token: string, id: string, data: { name?: string; isPublic?: boolean }): Promise<UserList> { return fetchUpdateList(token, id, data) }
  deleteList(token: string, id: string): Promise<void> { return fetchDeleteList(token, id) }
  addToList(token: string, listId: string, postId: number): Promise<UserList> { return fetchAddToList(token, listId, postId) }
  removeFromList(token: string, listId: string, postId: number): Promise<UserList> { return fetchRemoveFromList(token, listId, postId) }
  getBookmarks(token: string): Promise<number[]> { return fetchBookmarkedPosts(token) }
  toggleBookmark(token: string, postId: number, add: boolean): Promise<void> { return fetchToggleBookmark(token, postId, add) }
}
