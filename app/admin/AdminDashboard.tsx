import { Upload, IndianRupee, PackageCheck, PencilLine } from "lucide-react";
import { featuredProducts } from "@/data/products";
import { formatInr } from "@/lib/utils";

const steps = [
  {
    icon: Upload,
    title: "Upload product images",
    body: "Open Supabase Storage, create or select a product-images bucket, upload front and hover images, then copy each public URL into the product image fields."
  },
  {
    icon: PencilLine,
    title: "Edit product information",
    body: "Update product name, slug, color, badge, status, sizes, and image URLs. Keep slugs lowercase with hyphens, for example black-midi-dress."
  },
  {
    icon: IndianRupee,
    title: "Set Indian Rupee pricing",
    body: "Enter prices as whole INR numbers, such as 2499 or 15999. The storefront formats every product price as INR automatically."
  },
  {
    icon: PackageCheck,
    title: "Manage inventory",
    body: "Adjust stock counts when new pieces arrive, mark sold-out products as draft, and archive discontinued products."
  }
];

export function AdminDashboard() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-2 border-ink bg-white p-5 shadow-brutal-blue">
        <p className="mb-2 text-xs font-black uppercase text-electric-blue">
          Admin dashboard
        </p>
        <h1 className="text-4xl font-black uppercase leading-none tracking-normal sm:text-6xl">
          Product management guide
        </h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-ink/68 sm:text-base">
          This dashboard is protected by Supabase login and an admin allow-list.
          Use it to manage dress images, product details, INR pricing, and
          inventory.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article
              key={step.title}
              className="border-2 border-ink bg-white p-4 shadow-brutal"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center border-2 border-ink bg-electric-blue text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-black uppercase tracking-normal">
                {step.title}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink/66">
                {step.body}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="border-2 border-ink bg-white p-5 shadow-brutal">
          <h2 className="text-2xl font-black uppercase tracking-normal">
            Product fields
          </h2>
          <div className="mt-5 grid gap-4">
            <AdminField label="Product name" value="Black Satin Dress" />
            <AdminField label="Slug" value="black-satin-dress" />
            <AdminField label="Price (INR)" value="4999" />
            <AdminField label="Stock" value="24" />
            <AdminField label="Sizes" value="XS, S, M, L, XL" />
            <AdminField label="Front image URL" value="https://..." />
            <AdminField label="Hover image URL" value="https://..." />
          </div>
          <button
            type="button"
            className="mt-5 h-11 w-full border-2 border-ink bg-ink text-sm font-black uppercase text-white shadow-brutal-blue"
          >
            Save product
          </button>
        </form>

        <div className="overflow-hidden border-2 border-ink bg-white shadow-brutal">
          <div className="border-b-2 border-ink p-5">
            <h2 className="text-2xl font-black uppercase tracking-normal">
              Inventory snapshot
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-bone text-xs font-black uppercase">
                <tr>
                  <th className="border-b-2 border-ink p-4">Product</th>
                  <th className="border-b-2 border-ink p-4">Price</th>
                  <th className="border-b-2 border-ink p-4">Stock</th>
                  <th className="border-b-2 border-ink p-4">Status</th>
                  <th className="border-b-2 border-ink p-4">Sizes</th>
                </tr>
              </thead>
              <tbody>
                {featuredProducts.map((product) => (
                  <tr key={product.id} className="font-bold">
                    <td className="border-b border-ink/15 p-4">
                      {product.name}
                    </td>
                    <td className="border-b border-ink/15 p-4">
                      {formatInr(product.price)}
                    </td>
                    <td className="border-b border-ink/15 p-4">
                      {product.stock}
                    </td>
                    <td className="border-b border-ink/15 p-4 uppercase">
                      {product.status}
                    </td>
                    <td className="border-b border-ink/15 p-4">
                      {product.sizes.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminField({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase">
      {label}
      <input
        type="text"
        defaultValue={value}
        className="h-11 border-2 border-ink bg-bone px-3 text-sm font-bold normal-case outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
      />
    </label>
  );
}
