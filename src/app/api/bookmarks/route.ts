import { getAuthToken } from "@/lib/auth/session";
import { getUserDataRepository } from "@/lib/repositories/factory";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getAuthToken();
  if (!token)
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  try {
    const bookmarks = await getUserDataRepository().getBookmarks(token);
    return NextResponse.json(bookmarks);
  } catch {
    return NextResponse.json(
      { error: "Errore nel recupero dei bookmark." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const token = await getAuthToken();
  if (!token)
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  try {
    const { postId, add } = await request.json();
    await getUserDataRepository().toggleBookmark(token, postId, add);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("POST /api/bookmarks error:", e);
    return NextResponse.json(
      { error: "Errore nel modificare i bookmark." },
      { status: 500 },
    );
  }
}
