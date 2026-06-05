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
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="mb-2 text-xs font-black uppercase text-electric-blue">
        Order confirmed
      </p>
      <h1 className="text-4xl font-black uppercase sm:text-5xl">
        Thank you, {order.customer_name}
      </h1>
      <p className="mt-4 text-sm font-semibold text-ink/68">
        Mock payment succeeded. A confirmation was sent to {order.email}.
      </p>

      <div className="mt-8 border-2 border-ink bg-white p-5 shadow-brutal">
        <p className="text-xs font-black uppercase text-ink/55">Order ID</p>
        <p className="mt-1 font-mono text-sm font-bold">{order.id}</p>
        <p className="mt-4 text-xs font-black uppercase text-ink/55">Status</p>
        <p className="mt-1 text-sm font-black uppercase">{order.status}</p>
        <p className="mt-4 text-xs font-black uppercase text-ink/55">Total</p>
        <p className="mt-1 text-2xl font-black">{formatInr(order.total_inr)}</p>

        <ul className="mt-6 grid gap-3 border-t-2 border-ink/10 pt-4">
          {order.order_items?.map((item) => (
            <li
              key={`${item.product_name}-${item.size}`}
              className="flex items-center justify-between text-sm font-bold"
            >
              <span>
                {item.product_name} ({item.size}) × {item.quantity}
              </span>
              <span>{formatInr(item.line_total_inr)}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/products"
        className="mt-8 inline-flex h-11 items-center justify-center border-2 border-ink bg-ink px-5 text-sm font-black uppercase text-white"
      >
        Continue shopping
      </Link>
    </section>
  );
}
