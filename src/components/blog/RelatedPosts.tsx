import { getPostRepository } from "@/lib/repositories/factory";
import { Post } from "@/types";
import { PostCard } from "./PostCard";

export async function RelatedPosts({ post }: { post: Post }) {
  const repo = getPostRepository();
  const relatedPosts = await repo.getRelatedPosts(post.id);
  return (
    <>
      <h2>Related posts</h2>
      { relatedPosts.map((p) => {
            return <PostCard key={p.id} post={p} />
        })}
    </>
  );
}
