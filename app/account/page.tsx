import Link from "next/link";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";

export const metadata = {
  title: "Account | VIP Raiments"
};

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-ink bg-white p-5 shadow-brutal-blue">
        <p className="mb-2 text-xs font-black uppercase text-ink/50">
          Account access
        </p>
        <h1 className="text-4xl font-black uppercase leading-none tracking-normal sm:text-6xl">
          Customer and admin access
        </h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-ink/68 sm:text-base">
          Customers use account access for orders and profile details. Admins
          use the protected dashboard to manage products, prices, images, and
          inventory after the website is live.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <article className="border-2 border-ink bg-white p-5 shadow-brutal">
          <div className="mb-4 grid h-11 w-11 place-items-center border-2 border-ink bg-bone">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-normal">
            Customer account
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-ink/66">
            Add Supabase login here for order history, saved details, and
            checkout profiles.
          </p>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-brutal">
          <div className="mb-4 grid h-11 w-11 place-items-center border-2 border-ink bg-ink text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-normal">
            Admin dashboard
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-ink/66">
            On the live website, admins will open `/admin`. Protect it with
            Supabase Auth before launch.
          </p>
          <Link
            href="/admin"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 border-2 border-ink bg-ink px-4 text-sm font-black uppercase text-white shadow-brutal-blue"
          >
            Open admin guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      </div>
    </section>
  );
}
