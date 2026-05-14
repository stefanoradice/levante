import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/session";
import { getUserDataRepository } from "@/lib/repositories/factory";

export async function GET() {
  const token = await getAuthToken();
  if (!token)
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });

  try {
    const lists = await getUserDataRepository().getLists(token);
    return NextResponse.json(lists);
  } catch {
    return NextResponse.json(
      { error: "Errore nel recupero delle liste." },
      { status: 500 },
    );
  }
}
