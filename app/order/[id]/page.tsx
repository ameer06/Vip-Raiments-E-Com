import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders/get-order";
import { formatInr } from "@/lib/utils";

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: OrderPageProps) {
  const { id } = await params;
  return { title: `Order ${id.slice(0, 8)} | VIP Raiments` };
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <p className="mb-1 text-xs font-black uppercase text-ink/50 sm:mb-2">
        Order confirmed
      </p>
      <h1 className="text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
        Thank you, {order.customer_name}
      </h1>
      <p className="mt-3 text-sm font-semibold text-ink/68 sm:mt-4">
        Mock payment succeeded. A confirmation was sent to {order.email}.
      </p>

      <div className="mt-6 border-2 border-ink bg-white p-4 shadow-brutal sm:mt-8 sm:p-5">
        <p className="text-xs font-black uppercase text-ink/55">Order ID</p>
        <p className="mt-1 break-all font-mono text-sm font-bold">{order.id}</p>
        <p className="mt-4 text-xs font-black uppercase text-ink/55">Status</p>
        <p className="mt-1 text-sm font-black uppercase">{order.status}</p>
        <p className="mt-4 text-xs font-black uppercase text-ink/55">Total</p>
        <p className="mt-1 text-2xl font-black">{formatInr(order.total_inr)}</p>

        <ul className="mt-6 grid gap-3 border-t-2 border-ink/10 pt-4">
          {order.order_items?.map((item) => (
            <li
              key={`${item.product_name}-${item.size}`}
              className="flex items-center justify-between gap-4 text-sm font-bold"
            >
              <span className="min-w-0 truncate">
                {item.product_name} ({item.size}) × {item.quantity}
              </span>
              <span className="shrink-0">{formatInr(item.line_total_inr)}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/products"
        className="mt-6 inline-flex h-11 w-full items-center justify-center border-2 border-ink bg-ink px-5 text-sm font-black uppercase text-white sm:mt-8 sm:w-auto"
      >
        Continue shopping
      </Link>
    </section>
  );
}
