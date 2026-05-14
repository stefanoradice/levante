import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, User, ArrowLeft, MessageCircle } from "lucide-react";
import {
  getPostRepository,
  getCommentRepository,
} from "@/lib/repositories/factory";
import { Badge } from "@/components/ui/Badge";
import { SaveToListButton } from "@/components/blog/SaveToListButton";
import { CommentSection } from "@/components/blog/comments/CommentSection";
import { formatDate } from "@/lib/utils";
import { HistoryTracker } from "@/components/blog/HistoryTracker";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const repo = getPostRepository();
  const post = await repo.getPostBySlug(slug);

  if (!post) return { title: "Articolo non trovato" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modifiedDate,
      authors: [post.author.name],
      images: post.featuredImage ? [post.featuredImage.url] : [],
    },
  };
}

async function PostComments({ postId }: { postId: number }) {
  const commentRepo = getCommentRepository();
  const comments = await commentRepo.getComments(postId);
  return <CommentSection postId={postId} comments={comments} />;
}

function CommentsSkeleton() {
  return (
    <div className="mt-12 pt-10 border-t border-border">
      <div className="h-7 w-48 bg-background-secondary rounded animate-pulse mb-8" />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-background-secondary animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-background-secondary rounded animate-pulse" />
              <div className="h-4 bg-background-secondary rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-background-secondary rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const repo = getPostRepository();

  const post = await repo.getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <HistoryTracker postId={post.id} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted
          hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Torna al blog
      </Link>

      <div className="max-w-3xl mx-auto">
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat) => (
              <Link key={cat.id} href={`/blog?categoria=${cat.slug}`}>
                <Badge variant="accent">{cat.name}</Badge>
              </Link>
            ))}
          </div>
        )}

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

        <Suspense fallback={<CommentsSkeleton />}>
          <PostComments postId={post.id} />
        </Suspense>
      </div>
    </article>
  );
}
