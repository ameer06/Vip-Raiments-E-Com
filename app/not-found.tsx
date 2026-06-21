import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-5xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="text-center">
        <p className="label-mono mb-4 text-ink/50">404</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-control bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-ink/80"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
