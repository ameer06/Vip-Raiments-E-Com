import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-control bg-ink/10", className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-card border border-ink/10 bg-white shadow-card">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="grid gap-2 p-card-pad">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/5" />
        </div>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-9 w-full rounded-control" />
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-card border border-ink/10 bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-3 w-2/3" />
      <Skeleton className="mt-1 h-3 w-1/4" />
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
      <div className="grid gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-card border border-ink/10 bg-white p-6 shadow-card">
          <Skeleton className="h-6 w-32" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
      <div className="rounded-card border border-ink/10 bg-white p-6 shadow-card">
        <Skeleton className="h-6 w-24" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
