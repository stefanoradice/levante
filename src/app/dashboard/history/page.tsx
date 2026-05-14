"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { useHistory } from "@/components/layout/HistoryContext";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const { history } = useHistory();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const load = async () => {
      const postIds = history?.join(",");
      if (!postIds) return;
      try {
        const res = await fetch("/api/history/?ids=" + postIds);
        if (!res.ok) return;
        const data = await res.json();
        if (data) setPosts(data);
      } catch {
        // ignore
      }
    };
    load();
  }, [history]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted
          hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Clock size={22} className="text-accent shrink-0" />
        <h1 className="font-display font-bold text-2xl text-foreground">Cronologia</h1>
      </div>
      <p className="text-sm text-foreground-muted mb-10">
        {posts.length} {posts.length === 1 ? "articolo letto" : "articoli letti"}
      </p>

      {posts.length === 0 ? (
        <div className="py-20 text-center text-foreground-muted">
          <Clock size={40} className="mx-auto mb-4 opacity-30" />
          <p>Nessun articolo letto di recente.</p>
          <Link href="/blog" className="mt-4 inline-block text-sm text-accent hover:underline">
            Sfoglia il blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
