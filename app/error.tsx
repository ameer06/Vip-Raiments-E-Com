"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-5xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="text-center">
        <p className="label-mono mb-4 text-ink/50">500</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink/60">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-control bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-ink/80"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
