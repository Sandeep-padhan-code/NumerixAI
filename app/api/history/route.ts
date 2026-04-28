import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const subject = searchParams.get("subject") || "";

  const history = await prisma.solveHistory.findMany({
    where: {
      AND: [
        q ? { question: { contains: q } } : {},
        subject ? { subject } : {}
      ]
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return NextResponse.json({ history });
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.solveHistory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
