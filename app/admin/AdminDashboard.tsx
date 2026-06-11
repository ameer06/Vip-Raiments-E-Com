import { PackageCheck, PencilLine, Upload, IndianRupee } from "lucide-react";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

const steps = [
  {
    icon: Upload,
    title: "Upload product images",
    body: "Use Supabase Storage bucket product-images, then paste public URLs into the product editor."
  },
  {
    icon: PencilLine,
    title: "Edit products",
    body: "Click a row in the inventory table to load it, edit fields, then Save product."
  },
  {
    icon: IndianRupee,
    title: "INR pricing",
    body: "Enter whole INR numbers. The storefront formats prices automatically."
  },
  {
    icon: PackageCheck,
    title: "Orders",
    body: "Mock checkouts appear in Recent orders when Supabase orders tables are set up."
  }
];

export function AdminDashboard() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-section sm:px-6 lg:px-8">
      <div className="mb-section rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
        <p className="label-mono mb-2 text-ink/50">
          Admin dashboard
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Store management
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/60 sm:text-base">
          Manage products, inventory, and view orders. Run supabase/schema.sql in
          your Supabase project if tables are missing.
        </p>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-control bg-ink text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                {step.body}
              </p>
            </article>
          );
        })}
      </div>

      <AdminDashboardClient />
    </section>
  );
}
