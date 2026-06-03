"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/products", label: "Drops" },
  { href: "/products?filter=outerwear", label: "Outerwear" },
  { href: "/products?filter=essentials", label: "Essentials" }
];

export function Header() {
  const { scrollY } = useScroll();
  const [isPinned, setIsPinned] = useState(true);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    const delta = current - lastY;
    setIsPinned(current < 24 || delta < 0);
    setLastY(current);
  });

  return (
    <motion.header
      animate={{ y: isPinned ? 0 : -92 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b-2 border-ink/90 bg-bone/72 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center border-2 border-ink bg-electric-blue text-sm font-black text-white shadow-brutal transition-transform group-hover:-translate-y-0.5">
            VR
          </span>
          <span className="text-base font-black uppercase tracking-normal">
            VIP Raiments
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold uppercase tracking-normal text-ink/72 transition-colors hover:text-electric-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <IconLink href="/account" label="Account">
            <UserRound className="h-5 w-5" />
          </IconLink>
          <IconLink href="/cart" label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center border border-ink bg-electric-blue px-1 text-[10px] font-black text-white">
              0
            </span>
          </IconLink>
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center border-2 border-ink bg-white md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

function IconLink({
  href,
  label,
  className,
  children
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "grid h-10 w-10 place-items-center border-2 border-ink bg-white transition-transform hover:-translate-y-0.5 hover:bg-electric-blue hover:text-white",
        className
      )}
    >
      {children}
    </Link>
  );
}
