import { NextResponse } from 'next/server'
import { getCommentRepository } from '@/lib/repositories/factory'
import { getAuthToken } from '@/lib/auth/session'

export async function POST(request: Request) {
  const body = await request.json() as {
    postId?: number
    parentId?: number
    authorName?: string
    authorEmail?: string
    content?: string
  }

  if (!body.postId || !body.authorName || !body.authorEmail || !body.content) {
    return NextResponse.json({ message: 'Campi obbligatori mancanti.' }, { status: 400 })
  }

  const token = await getAuthToken()
  const repo = getCommentRepository()

  try {
    const comment = await repo.submitComment({
      postId: body.postId,
      parentId: body.parentId,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      content: body.content,
      token: token ?? undefined,
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Errore server.'
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
