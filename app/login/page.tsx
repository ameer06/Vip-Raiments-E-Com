import { Suspense } from "react";
import { LoginForm } from "@/components/features/LoginForm";

export const metadata = {
  title: "Admin Login | VIP Raiments"
};

export default function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="border-2 border-ink bg-white p-5 shadow-brutal-blue">
          <p className="mb-2 text-xs font-black uppercase text-electric-blue">
            Protected access
          </p>
          <h1 className="text-4xl font-black uppercase leading-none tracking-normal sm:text-6xl">
            Admin login
          </h1>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink/68 sm:text-base">
            Sign in with the Supabase admin account. Only users listed in the
            `admin_users` table can open the dashboard.
          </p>
        </div>

        <div className="border-2 border-ink bg-white p-5 shadow-brutal">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
