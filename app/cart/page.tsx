import { CartView } from "@/components/features/CartView";

export const metadata = {
  title: "Cart | VIP Raiments"
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <p className="label-mono mb-1 text-ink/50 sm:mb-2">Cart</p>
      <h1 className="mb-6 text-3xl font-bold tracking-tight sm:mb-8 sm:text-4xl lg:text-6xl">Your bag</h1>
      <CartView />
    </section>
  );
}
