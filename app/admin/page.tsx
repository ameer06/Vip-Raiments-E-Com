import { redirect } from "next/navigation";
import { AdminDashboard } from "@/app/admin/AdminDashboard";
import {
  createSupabaseServerClient,
  hasSupabaseEnv
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | VIP Raiments"
};

export default async function AdminPage() {
  if (!hasSupabaseEnv()) {
    redirect("/login?next=/admin");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !adminUser) {
    redirect("/login?next=/admin&error=not-admin");
  }

  return <AdminDashboard />;
}
