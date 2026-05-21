"use client"

import { Badge } from "@/components/ui/Badge";
import { SaveToListButton } from "@/components/blog/SaveToListButton";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Clock, Calendar, User, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { Post } from "@/types";

export function PostContent({ post }: { post: Post }) {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="max-w-3xl mx-auto" ref={contentRef}>
      {post.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((cat) => (
            <Link key={cat.id} href={`/blog?categoria=${cat.slug}`}>
              <Badge variant="accent">{cat.name}</Badge>
            </Link>
          ))}
        </div>
      )}
      <ReadingProgressBar contentRef={contentRef}/>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground leading-tight mb-4">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted mb-8 pb-8 border-b border-border">
        <Link
          href={`/autore/${post.author.slug}`}
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          {post.author.avatarUrl ? (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <User size={16} />
          )}
          {post.author.name}
        </Link>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {formatDate(post.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} />
          {post.readingTime} min di lettura
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle size={14} />
          {post.commentCount} commenti
        </span>
        <div className="ml-auto">
          <SaveToListButton postId={post.id} />
        </div>
      </div>

      {post.featuredImage && (
        <div className="relative w-full rounded-xl overflow-hidden mb-10 aspect-video">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-stone dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-semibold
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-code:text-accent"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
          {post.tags.map((tag) => (
            <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
              <Badge variant="default">#{tag.name}</Badge>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
