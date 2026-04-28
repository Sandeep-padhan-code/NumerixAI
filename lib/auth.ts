import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "numerixai_session";
const DEFAULT_PASSWORD_HASH = "be3e17b76fc34d2b9f45aaee4c8c5188475a808b7164a76b60efa2f6dbc8b52c";

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function getExpectedPasswordHash() {
  return process.env.APP_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;
}

export async function getStoredPasswordHash() {
  const setting = await prisma.appSetting.findUnique({ where: { key: "passwordHash" } });
  return setting?.value || getExpectedPasswordHash();
}

export async function verifyPassword(password: string) {
  return hashPassword(password) === (await getStoredPasswordHash());
}

function sessionSecret() {
  return process.env.APP_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;
}

export function createSessionToken() {
  const payload = JSON.stringify({ createdAt: Date.now(), app: "numerixai" });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token?: string) {
  if (!token || !token.includes(".")) {
    return false;
  }

  const [encoded, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return false;
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as { createdAt: number };
  const maxAge = 1000 * 60 * 60 * 24 * 14;
  return Date.now() - payload.createdAt < maxAge;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const authCookieName = COOKIE_NAME;
