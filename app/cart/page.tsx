import { CartView } from "@/components/features/CartView";

export const metadata = {
  title: "Cart | VIP Raiments"
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="mb-2 text-xs font-black uppercase text-electric-blue">Cart</p>
      <h1 className="mb-8 text-4xl font-black uppercase sm:text-6xl">Your bag</h1>
      <CartView />
    </section>
  );
}
