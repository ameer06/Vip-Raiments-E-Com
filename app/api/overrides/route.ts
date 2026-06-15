import { NextResponse } from "next/server";

const COOKIE = "admin_overrides";

export async function POST(request: Request) {
  const { id, data } = await request.json();
  const raw = request.headers.get("cookie") ?? "";
  let overrides: Record<string, object> = {};
  const match = raw.match(new RegExp(`${COOKIE}=([^;]+)`));
  if (match) {
    try {
      overrides = JSON.parse(decodeURIComponent(match[1]));
    } catch { /* ignore corrupt cookie */ }
  }
  overrides[id] = data;

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, JSON.stringify(overrides), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax"
  });
  return response;
}