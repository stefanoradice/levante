import { getPostRepository } from "@/lib/repositories/factory";
import { Post } from "@/types";
import { PostCard } from "./PostCard";

export async function RelatedPosts({ post }: { post: Post }) {
  const repo = getPostRepository();
  const relatedPosts = await repo.getRelatedPosts(post.id);

  if (relatedPosts.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-foreground mb-8">
        Articoli correlati
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {relatedPosts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
