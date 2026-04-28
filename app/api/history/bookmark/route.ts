import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { id, bookmarked } = (await request.json()) as { id?: string; bookmarked?: boolean };
  if (!id || typeof bookmarked !== "boolean") {
    return NextResponse.json({ error: "Invalid bookmark request" }, { status: 400 });
  }

  const record = await prisma.solveHistory.update({ where: { id }, data: { bookmarked } });
  return NextResponse.json({ record });
}
