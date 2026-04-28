import { NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as { currentPassword?: string; newPassword?: string };

  if (!body.currentPassword || !(await verifyPassword(body.currentPassword))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  if (!body.newPassword || body.newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
  }

  await prisma.appSetting.upsert({
    where: { key: "passwordHash" },
    create: { key: "passwordHash", value: hashPassword(body.newPassword) },
    update: { value: hashPassword(body.newPassword) }
  });

  return NextResponse.json({ ok: true });
}
