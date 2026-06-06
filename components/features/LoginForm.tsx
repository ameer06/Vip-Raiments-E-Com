"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserEnv
} from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(
    () => searchParams.get("next") || "/admin",
    [searchParams]
  );
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    error === "not-admin"
      ? "This account is not on the admin allow-list."
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = hasSupabaseBrowserEnv();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setMessage("Add Supabase environment variables before using login.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setIsSubmitting(false);

    if (signInError) {
      setMessage(signInError.message);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {!isConfigured ? (
        <div className="border-2 border-ink bg-bone p-3 text-sm font-bold text-ink/72">
          Supabase is not configured yet. Add the environment variables in
          `.env.local` for local login and in Vercel for live login.
        </div>
      ) : null}

      {message ? (
        <div className="border-2 border-ink bg-bone p-3 text-sm font-bold text-ink/72">
          {message}
        </div>
      ) : null}

      <label className="grid gap-2 text-xs font-black uppercase">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="h-11 border-2 border-ink bg-bone px-3 text-sm font-bold normal-case outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
        />
      </label>

      <label className="grid gap-2 text-xs font-black uppercase">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="h-11 border-2 border-ink bg-bone px-3 text-sm font-bold normal-case outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-4 text-sm font-black uppercase text-white shadow-brutal-blue disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" />
        {isSubmitting ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
