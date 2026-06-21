import { OrderDetailSkeleton } from "@/components/ui/Skeleton";

export default function OrderLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <OrderDetailSkeleton />
    </section>
  );
}
