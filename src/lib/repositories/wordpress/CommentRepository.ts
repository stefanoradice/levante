import type { ICommentRepository } from '../interfaces'
import type { Comment } from '@/types'
import { fetchComments, submitComment } from '@/lib/api/wordpress/client'
import { mapComment } from '@/lib/api/wordpress/mappers'

export class WordPressCommentRepository implements ICommentRepository {
  async getComments(postId: number): Promise<Comment[]> {
    const wps = await fetchComments(postId)
    return wps.map(mapComment)
  }

  async submitComment(data: {
    postId: number
    parentId?: number
    authorName: string
    authorEmail: string
    content: string
    token?: string
  }): Promise<Comment> {
    const wp = await submitComment(data)
    return mapComment(wp)
  }
}
