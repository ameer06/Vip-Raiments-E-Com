import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:pt-12 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <div className="mb-1 h-4 w-24 animate-pulse rounded bg-ink/10 sm:mb-2" />
        <div className="h-8 w-48 animate-pulse rounded bg-ink/10 sm:h-10" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full sm:max-w-xs animate-pulse rounded-control bg-ink/10" />
        <div className="flex items-center gap-3">
          <div className="h-4 w-20 animate-pulse rounded bg-ink/10" />
          <div className="h-10 w-40 animate-pulse rounded-control bg-ink/10" />
        </div>
      </div>

      <ProductGridSkeleton count={4} />
    </section>
  );
}
