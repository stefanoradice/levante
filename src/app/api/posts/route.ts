import { NextResponse } from "next/server";
import { getPostRepository } from "@/lib/repositories/factory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = parseInt(searchParams.get("perPage") ?? "9", 10);
  const categoryId = searchParams.get("categoryId")
    ? parseInt(searchParams.get("categoryId")!, 10)
    : undefined;
  const tagId = searchParams.get("tagId")
    ? parseInt(searchParams.get("tagId")!, 10)
    : undefined;
  const search = searchParams.get("search") ?? undefined;
  const relatedPostId = searchParams.get("relatedPostId")
    ? parseInt(searchParams.get("relatedPostId")!, 10)
    : undefined;
  const repo = getPostRepository();
  const result = await repo.getPosts({
    page,
    perPage,
    categoryId,
    tagId,
    search,
    relatedPostId,
  });

  return NextResponse.json(result);
}
