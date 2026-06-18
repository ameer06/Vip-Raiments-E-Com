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
        <div className="rounded-control border border-ink/10 bg-surface p-3 text-sm text-ink/60">
          Supabase is not configured yet. Add the environment variables in
          `.env.local` for local login and in Vercel for live login.
        </div>
      ) : null}

      {message ? (
        <div className="rounded-control border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {message}
        </div>
      ) : null}

      <label className="grid gap-1.5">
        <span className="label-mono">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm font-normal text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="label-mono">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm font-normal text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-control bg-ink px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" />
        {isSubmitting ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
