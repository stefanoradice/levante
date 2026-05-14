import Image from 'next/image'
import type { Comment } from '@/types'
import { formatDate } from '@/lib/utils'

interface CommentItemProps {
  comment: Comment
  replies: Comment[]
  onReply: (parentId: number) => void
}

export function CommentItem({ comment, replies, onReply }: CommentItemProps) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0">
        {comment.authorAvatarUrl ? (
          <Image
            src={comment.authorAvatarUrl}
            alt={comment.authorName}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-background-secondary flex items-center justify-center
            text-foreground-muted font-medium text-sm">
            {comment.authorName[0]?.toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
          <span className="font-medium text-sm text-foreground">{comment.authorName}</span>
          <span className="text-xs text-foreground-muted">{formatDate(comment.date)}</span>
        </div>

        <div
          className="prose prose-sm max-w-none text-foreground-muted
            prose-p:my-1"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />

        <button
          onClick={() => onReply(comment.id)}
          className="mt-2 text-xs text-accent hover:text-accent-hover font-medium
            transition-colors duration-150"
        >
          Rispondi
        </button>

        {replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-border space-y-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={[]}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
