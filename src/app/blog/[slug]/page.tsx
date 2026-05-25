import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getCommentRepository,
  getPostRepository,
} from "@/lib/repositories/factory";
import { HistoryTracker } from "@/components/blog/HistoryTracker";
import { PostContent } from "@/components/blog/PostContent";
import { CommentSection } from "@/components/blog/comments/CommentSection";
import { Suspense } from "react";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { PostsSkeleton } from "@/components/ui/PostKeleton";

interface PostPageProps {
  params: Promise<{ slug: string }>;
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

export async function PostComments({ postId }: { postId: number }) {
  const commentRepo = getCommentRepository();
  const comments = await commentRepo.getComments(postId);
  return <CommentSection postId={postId} comments={comments} />;
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
      <PostContent post={post} />
      <Suspense fallback={<CommentsSkeleton />}>
        <PostComments postId={post.id} />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <RelatedPosts post={post} />
      </Suspense>
    </article>
  );
}
