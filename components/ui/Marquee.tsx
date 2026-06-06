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
            className="inline-flex items-center gap-8 text-xs font-black uppercase tracking-normal sm:text-sm"
          >
            {item}
            <span className="h-3 w-3 bg-electric-blue" aria-hidden="true" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
