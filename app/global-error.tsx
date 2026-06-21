"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <section className="mx-auto grid min-h-screen max-w-5xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="text-center">
            <p className="mb-4 font-mono text-sm text-gray-500">Error</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Something went wrong
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600">
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={reset}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-black/80"
            >
              Try again
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
