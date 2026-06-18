import { Suspense } from "react";
import { LoginForm } from "@/components/features/LoginForm";

export const metadata = {
  title: "Admin Login | VIP Raiments"
};

export default function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-5xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <p className="label-mono mb-2 text-ink/50">
            Protected access
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-6xl">
            Admin login
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/60 sm:mt-4 sm:text-base">
            Sign in with the Supabase admin account. Only users listed in the
            `admin_users` table can open the dashboard.
          </p>
        </div>

        <div className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
