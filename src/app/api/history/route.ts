import { getPostRepository } from "@/lib/repositories/factory";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postIds = searchParams.get("ids") ?? null;
    const Ids = postIds?.split(",").map(Number);
    const posts = await getPostRepository().getPostsByIds(Ids ?? []);
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Errore nel recupero delle liste." },
      { status: 500 },
    );
  }
}
