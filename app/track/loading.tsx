import { OrderCardSkeleton } from "@/components/ui/Skeleton";

export default function TrackLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 h-4 w-32 animate-pulse rounded bg-ink/10" />
        <div className="h-8 w-48 animate-pulse rounded bg-ink/10" />
      </div>
      <div className="mb-6 flex gap-3">
        <div className="h-10 flex-1 animate-pulse rounded-control bg-ink/10" />
        <div className="h-10 w-24 animate-pulse rounded-control bg-ink/10" />
      </div>
      <div className="grid gap-4">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </section>
  );
}
