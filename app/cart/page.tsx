import { CartView } from "@/components/features/CartView";

export const metadata = {
  title: "Cart | VIP Raiments"
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <p className="mb-1 text-xs font-black uppercase text-electric-blue sm:mb-2">Cart</p>
      <h1 className="mb-6 text-3xl font-black uppercase sm:mb-8 sm:text-4xl lg:text-6xl">Your bag</h1>
      <CartView />
    </section>
  );
}
