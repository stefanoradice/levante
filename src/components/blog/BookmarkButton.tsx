"use client";

import { useTransition } from "react";
import { useAuth } from "../layout/AuthContext";
import { useBookmarks } from "../layout/BookmarksContext";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export function BookmarkButton({ postId }: { postId: number }) {
  const { isLoggedIn } = useAuth();
  const { bookmarks, setBookmarks } = useBookmarks();
  const isBookmarked = bookmarks ? bookmarks.includes(postId) : false;
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const newBookmarks = isBookmarked
      ? bookmarks!.filter((id) => id !== postId)
      : [...(bookmarks || []), postId];

    setBookmarks(newBookmarks as number[]);

    startTransition(async () => {
      try {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, add: !isBookmarked }),
        });
        if (!res.ok) setBookmarks(bookmarks);
      } catch {
        setBookmarks(bookmarks);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="w-full flex items-center gap-3 px-3 py-2 text-sm
                    transition-colors disabled:opacity-60"
    >
      <Heart
        size={16}
        fill={isBookmarked ? "currentColor" : "none"}
        className="text-foreground-muted shrink-0"
      />
    </button>
  );
}
