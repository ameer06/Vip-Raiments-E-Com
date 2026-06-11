import Link from "next/link";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";

export const metadata = {
  title: "Account | VIP Raiments"
};

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-section sm:px-6 lg:px-8">
      <div className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
        <p className="label-mono mb-2 text-ink/50">
          Account access
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Customer and admin access
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/60 sm:text-base">
          Customers use account access for orders and profile details. Admins
          use the protected dashboard to manage products, prices, images, and
          inventory after the website is live.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <article className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-control border border-ink/10 bg-surface">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Customer account
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            Add Supabase login here for order history, saved details, and
            checkout profiles.
          </p>
        </article>

        <article className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-control bg-ink text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Admin dashboard
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            On the live website, admins will open `/admin`. Protect it with
            Supabase Auth before launch.
          </p>
          <Link
            href="/admin"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-control bg-ink px-4 text-sm font-semibold text-white"
          >
            Open admin guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      </div>
    </section>
  );
}
