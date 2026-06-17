"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";
import { trendingDrops } from "@/data/products";

export function Hero() {
  return (
    <section className="border-b border-ink/10">
      <div className="mx-auto max-w-7xl px-4 py-section sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <span className="label-mono inline-flex w-fit items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              Limited drop live
            </span>
            <h1 className="mt-6 max-w-4xl text-balance text-[clamp(2.5rem,6.5vw,5rem)] font-bold leading-[1.05] tracking-tight">
              Wear the room before you enter it.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
              Monochrome pants, sharp t-shits, and premium black & white
              details built for high-velocity weekly releases.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-control bg-ink px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Shop the drop
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?filter=new"
                className="inline-flex h-11 items-center justify-center rounded-control border border-ink/20 bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-surface"
              >
                New arrivals
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
            className="w-full lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-ink sm:aspect-[5/6] lg:aspect-[4/5]">
              <span className="label-mono absolute left-4 top-4 z-10 rounded-control bg-white/90 px-3 py-1.5 text-ink sm:left-5 sm:top-5">
                48h capsule
              </span>
              <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"
                role="img"
                aria-label="Featured capsule look"
              />
            </div>
          </motion.div>
        </div>

        <div className="mt-section w-full">
          <div className="rounded-card border border-ink/10 bg-surface py-3">
            <Marquee items={trendingDrops} />
          </div>
        </div>
      </div>
    </section>
  );
}