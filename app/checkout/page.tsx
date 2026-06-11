import { CheckoutForm } from "@/components/features/CheckoutForm";

export const metadata = {
  title: "Checkout | VIP Raiments"
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <p className="mb-1 text-xs font-black uppercase text-ink/50 sm:mb-2">
        Checkout
      </p>
      <h1 className="mb-6 text-3xl font-black uppercase sm:mb-8 sm:text-4xl lg:text-6xl">
        Complete order
      </h1>
      <CheckoutForm />
    </section>
  );
}
