import { NextResponse } from "next/server";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

const COOKIE = "admin_overrides";

export async function POST(request: Request) {
  const { id, data } = await request.json();

  // Save to Supabase product_overrides table using admin's auth session
  // (works without service role key — RLS allows admin users to write)
  if (hasSupabaseEnv()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.from("product_overrides").upsert(
        { product_id: id, overrides: data, updated_at: new Date().toISOString() },
        { onConflict: "product_id" }
      );
    } catch { /* table may not exist yet — fall through */ }
  }

  // Always set cookie as fallback
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