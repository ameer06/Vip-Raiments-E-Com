import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export async function requireAdmin() {
  if (!hasSupabaseEnv()) {
    return { ok: false as const, error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Not authenticated." };
  }

  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !adminUser) {
    return { ok: false as const, error: "Not authorized." };
  }

  return { ok: true as const, user };
}
