import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { subjects } from "@/types/solver";

const schema = z.object({
  title: z.string().min(1),
  subject: z.enum(subjects),
  formula: z.string().min(1),
  notes: z.string().optional()
});

export async function GET() {
  const formulas = await prisma.formulaItem.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ formulas });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid formula" }, { status: 400 });
  }

  const formula = await prisma.formulaItem.create({ data: parsed.data });
  return NextResponse.json({ formula });
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.formulaItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
