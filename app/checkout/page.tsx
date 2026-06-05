import { CheckoutForm } from "@/components/features/CheckoutForm";

export const metadata = {
  title: "Checkout | VIP Raiments"
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="mb-2 text-xs font-black uppercase text-electric-blue">
        Checkout
      </p>
      <h1 className="mb-8 text-4xl font-black uppercase sm:text-6xl">
        Complete order
      </h1>
      <CheckoutForm />
    </section>
  );
}
