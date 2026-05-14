'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import type { Comment } from '@/types'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'

interface CommentSectionProps {
  postId: number
  comments: Comment[]
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const [replyTo, setReplyTo] = useState<number | null>(null)

  const rootComments = comments.filter((c) => c.parentId === 0)
  const getReplies = (parentId: number) =>
    comments.filter((c) => c.parentId === parentId)

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <h2 className="font-display font-semibold text-xl text-foreground mb-8 flex items-center gap-2">
        <MessageCircle size={20} className="text-accent" />
        Commenti ({comments.length})
      </h2>

      {/* Comments list */}
      {rootComments.length > 0 ? (
        <div className="space-y-8 mb-10">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              onReply={(id) => setReplyTo(replyTo === id ? null : id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-foreground-muted text-sm mb-8">
          Nessun commento ancora. Sii il primo!
        </p>
      )}

      {/* New comment / reply form */}
      <div className="bg-background-secondary rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-4">
          {replyTo ? 'Rispondi' : 'Lascia un commento'}
        </h3>
        <CommentForm
          postId={postId}
          parentId={replyTo ?? undefined}
          onCancel={() => setReplyTo(null)}
        />
      </div>
    </section>
  )
}
