import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { subjects } from "@/types/solver";

const schema = z.object({
  title: z.string().min(1),
  subject: z.enum(subjects),
  content: z.string().min(1),
  pinned: z.boolean().optional()
});

export async function GET() {
  const notes = await prisma.revisionNote.findMany({ orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] });
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid note" }, { status: 400 });
  }

  const note = await prisma.revisionNote.create({ data: parsed.data });
  return NextResponse.json({ note });
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.revisionNote.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
