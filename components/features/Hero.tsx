"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";
import { trendingDrops } from "@/data/products";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl content-between px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 border-2 border-ink bg-white px-3 py-2 text-xs font-black uppercase tracking-normal shadow-brutal-blue">
              <Sparkles className="h-4 w-4 text-electric-blue" />
              Limited drop live
            </div>
            <h1 className="max-w-5xl text-balance text-6xl font-black uppercase leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">
              Wear the room before you enter it.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-ink/70 sm:text-lg">
              Monochrome essentials, sharp outerwear, and electric-blue details
              built for high-velocity weekly releases.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 border-2 border-ink bg-ink px-5 text-sm font-black uppercase text-white shadow-brutal-blue transition-transform hover:-translate-y-0.5"
              >
                Shop the drop
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?filter=new"
                className="inline-flex h-12 items-center justify-center border-2 border-ink bg-white px-5 text-sm font-black uppercase shadow-brutal transition-transform hover:-translate-y-0.5 hover:bg-electric-blue hover:text-white"
              >
                New arrivals
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
            className="relative min-h-[420px] border-2 border-ink bg-ink p-3 shadow-brutal-blue sm:min-h-[520px]"
          >
            <div className="absolute left-5 top-5 z-10 border-2 border-ink bg-electric-blue px-3 py-2 text-xs font-black uppercase text-white">
              48h capsule
            </div>
            <div className="h-full min-h-[396px] bg-[url('https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center grayscale sm:min-h-[496px]" />
          </motion.div>
        </div>

        <div className="mt-8 border-2 border-ink bg-white py-3 shadow-brutal">
          <Marquee items={trendingDrops} />
        </div>
      </div>
    </section>
  );
}
