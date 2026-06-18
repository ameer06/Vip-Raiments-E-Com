import { NextResponse } from "next/server";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";

const COOKIE = "admin_overrides";
const BUCKET = "product-overrides";
const FILE = "overrides.json";

async function readFromStorage(): Promise<Record<string, object>> {
  if (!hasSupabaseServiceRole()) return {};
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase.storage.from(BUCKET).download(FILE);
    if (data) return JSON.parse(await data.text());
  } catch { /* ignore */ }
  return {};
}

async function writeToStorage(overrides: Record<string, object>): Promise<boolean> {
  if (!hasSupabaseServiceRole()) return false;
  try {
    const supabase = createSupabaseAdminClient();

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, { public: true });
    }

    const blob = new Blob([JSON.stringify(overrides)], { type: "application/json" });
    const { error } = await supabase.storage.from(BUCKET).upload(FILE, blob, {
      upsert: true,
      cacheControl: "60"
    });
    return !error;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const { id, data } = await request.json();

  // Read existing overrides from Supabase Storage (shared across all devices)
  let overrides = await readFromStorage();

  // Also merge from cookie for any local-only data
  const raw = request.headers.get("cookie") ?? "";
  const match = raw.match(new RegExp(`${COOKIE}=([^;]+)`));
  if (match) {
    try {
      const cookieOverrides = JSON.parse(decodeURIComponent(match[1]));
      overrides = { ...cookieOverrides, ...overrides };
    } catch { /* ignore corrupt cookie */ }
  }

  overrides[id] = data;

  // Write to Supabase Storage (shared, persists across devices)
  await writeToStorage(overrides);

  // Also set cookie for same-browser speed
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, JSON.stringify(overrides), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax"
  });
  return response;
}