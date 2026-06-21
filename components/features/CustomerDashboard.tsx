"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Package, UserRound, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CustomerOrdersList } from "@/components/features/CustomerOrdersList";

type Tab = "orders" | "profile";

export function CustomerDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user: authUser }
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/account/login");
        return;
      }

      const { data: profile } = await supabase
        .from("customer_profiles")
        .select("full_name")
        .eq("id", authUser.id)
        .single();

      setUser({
        email: authUser.email ?? "",
        name: profile?.full_name ?? authUser.user_metadata?.full_name ?? ""
      });
      setIsLoading(false);
    }

    load();
  }, [router]);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-ink/40" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label-mono mb-1 text-ink/50">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {user?.name || "My Account"}
          </h1>
          <p className="mt-1 text-sm text-ink/50">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex h-10 items-center gap-2 rounded-control border border-ink/10 bg-white px-4 text-sm font-medium text-ink/60 transition-colors hover:bg-surface hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <div className="mb-6 flex gap-1 border-b border-ink/10">
        <TabButton
          active={tab === "orders"}
          onClick={() => setTab("orders")}
          icon={<Package className="h-4 w-4" />}
        >
          Orders
        </TabButton>
        <TabButton
          active={tab === "profile"}
          onClick={() => setTab("profile")}
          icon={<UserRound className="h-4 w-4" />}
        >
          Profile
        </TabButton>
      </div>

      {tab === "orders" && <CustomerOrdersList />}
      {tab === "profile" && <CustomerProfile user={user} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-ink text-ink"
          : "border-transparent text-ink/50 hover:text-ink"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function CustomerProfile({ user }: { user: { email: string; name: string } | null }) {
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    const {
      data: { user: authUser }
    } = await supabase.auth.getUser();

    if (!authUser) {
      setMessage("Not authenticated.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("customer_profiles").upsert({
      id: authUser.id,
      full_name: fullName,
      phone: phone || null
    });

    setIsSaving(false);
    setMessage(error ? error.message : "Profile saved!");
  }

  return (
    <form onSubmit={handleSave} className="grid max-w-md gap-4">
      {message && (
        <div
          className={`rounded-control border p-3 text-sm ${
            message === "Profile saved!"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <label className="grid gap-1.5">
        <span className="label-mono">Email</span>
        <input
          type="email"
          value={user?.email ?? ""}
          disabled
          className="h-11 rounded-control border border-ink/10 bg-surface px-3 text-sm text-ink/50"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="label-mono">Full name</span>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="label-mono">Phone</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex h-11 items-center justify-center rounded-control bg-ink px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
