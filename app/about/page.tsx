import Link from "next/link";

export const metadata = {
  title: "About | VIP Raiments"
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="label-mono mb-2 text-ink/50">About Us</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        VIP Raiments
      </h1>
      <p className="mt-2 text-sm text-ink/40">Premium Streetwear from India</p>

      <div className="mt-8 grid gap-6 text-sm leading-relaxed text-ink/70">
        <p>
          VIP Raiments is a premium streetwear brand built for first-look buyers.
          We design limited-run pieces that you won&apos;t find anywhere else.
          Once they&apos;re gone, they&apos;re gone — no restocks.
        </p>

        <p>
          Every piece is crafted with attention to detail, from the fabric selection
          to the final stitch. We believe in quality over quantity, and exclusivity
          over mass production.
        </p>

        <h2 className="text-lg font-semibold text-ink">Our Philosophy</h2>
        <p>
          Streetwear isn&apos;t just clothing — it&apos;s identity. Each drop is a statement.
          We design for people who move fast, think different, and dress to be noticed.
        </p>

        <h2 className="text-lg font-semibold text-ink">Quality Promise</h2>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>Premium fabrics sourced from trusted mills</li>
          <li>Small-batch production for quality control</li>
          <li>Every piece inspected before shipping</li>
          <li>Hassle-free returns within 7 days</li>
        </ul>

        <h2 className="text-lg font-semibold text-ink">Get in Touch</h2>
        <p>
          Questions? Feedback? Reach us at{" "}
          <a
            href="mailto:vipraiments@gmail.com"
            className="font-medium text-ink underline underline-offset-2 hover:text-ink/70"
          >
            vipraiments@gmail.com
          </a>
        </p>

        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-control bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-ink/80"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
