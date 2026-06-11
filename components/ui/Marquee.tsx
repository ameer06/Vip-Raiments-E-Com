"use client";

import { motion } from "framer-motion";

type MarqueeProps = {
  items: string[];
};

export function Marquee({ items }: MarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap" aria-label="Trending drops">
      <motion.div
        className="inline-flex min-w-full gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-8 text-xs font-semibold uppercase tracking-wider sm:text-sm"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
