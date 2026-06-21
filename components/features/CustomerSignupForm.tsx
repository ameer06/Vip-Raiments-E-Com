"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserEnv
} from "@/lib/supabase/client";

export function CustomerSignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = hasSupabaseBrowserEnv();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isConfigured) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (signUpError) {
      setMessage(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("customer_profiles")
        .upsert({
          id: data.user.id,
          full_name: fullName
        });

      if (profileError) {
        console.warn("Profile save failed:", profileError.message);
      }
    }

    setIsSubmitting(false);
    setMessage("Account created! Check your email for a confirmation link.");
    setFullName("");
    setEmail("");
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {!isConfigured ? (
        <div className="rounded-control border border-ink/10 bg-surface p-3 text-sm text-ink/60">
          Supabase is not configured yet.
        </div>
      ) : null}

      {message ? (
        <div
          className={`rounded-control border p-3 text-sm ${
            message.includes("created")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <label className="grid gap-1.5">
        <span className="label-mono">Full name</span>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          required
          className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm font-normal text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="label-mono">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
          className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm font-normal text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-control bg-ink px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UserPlus className="h-4 w-4" />
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
