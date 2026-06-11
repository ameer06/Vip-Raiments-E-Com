"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";
import { trendingDrops } from "@/data/products";

export function Hero() {
  return (
    <section className="border-b-2 border-ink">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <div className="brutal-shadow-room inline-flex w-fit">
              <div className="inline-flex items-center gap-2 border-2 border-ink bg-white px-3 py-2 text-xs font-black uppercase tracking-normal shadow-brutal-blue">
                <Sparkles className="h-4 w-4 shrink-0 text-ink" />
                Limited drop live
              </div>
            </div>
            <h1 className="mt-4 max-w-4xl text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase leading-[0.92] tracking-normal sm:mt-5">
              Wear the room before you enter it.
            </h1>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-ink/70 sm:mt-5 sm:text-base lg:text-lg">
              Monochrome essentials, sharp outerwear, and premium black & white
              details built for high-velocity weekly releases.
            </p>
            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-end">
              <div className="brutal-shadow-room w-full sm:w-auto">
                <Link
                  href="/products"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-5 text-sm font-black uppercase text-white shadow-brutal-blue transition-transform hover:-translate-y-0.5 sm:w-auto"
                >
                  Shop the drop
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="brutal-shadow-room w-full sm:w-auto">
                <Link
                  href="/products?filter=new"
                  className="inline-flex h-12 w-full items-center justify-center border-2 border-ink bg-white px-5 text-sm font-black uppercase shadow-brutal transition-transform hover:-translate-y-0.5 hover:bg-electric-blue hover:text-white sm:w-auto"
                >
                  New arrivals
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
            className="brutal-shadow-room w-full lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-ink bg-ink shadow-brutal-blue sm:aspect-[5/6] lg:aspect-[4/5]">
              <div className="absolute left-4 top-4 z-10 border-2 border-ink bg-ink px-3 py-2 text-xs font-black uppercase text-white sm:left-5 sm:top-5">
                48h capsule
              </div>
              <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center grayscale"
                role="img"
                aria-label="Featured capsule look"
              />
            </div>
          </motion.div>
        </div>

        <div className="brutal-shadow-room mt-8 w-full lg:mt-10">
          <div className="w-full border-2 border-ink bg-white py-3 shadow-brutal">
            <Marquee items={trendingDrops} />
          </div>
        </div>
      </div>
    </section>
  );
}
