import { Suspense } from "react";
import Link from "next/link";
import { CustomerLoginForm } from "@/components/features/CustomerLoginForm";

export const metadata = {
  title: "Sign In | VIP Raiments"
};

export default function CustomerLoginPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-5xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <p className="label-mono mb-2 text-ink/50">
            Customer access
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-6xl">
            Sign in
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/60 sm:mt-4 sm:text-base">
            Access your order history, track shipments, and manage your
            profile.
          </p>
          <p className="mt-4 text-sm text-ink/50">
            Don&apos;t have an account?{" "}
            <Link
              href="/account/signup"
              className="font-medium text-ink underline underline-offset-2 hover:text-ink/70"
            >
              Create one
            </Link>
          </p>
        </div>

        <div className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <Suspense>
            <CustomerLoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
