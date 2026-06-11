"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/products", label: "Drops" },
  { href: "/products?filter=outerwear", label: "Outerwear" },
  { href: "/products?filter=essentials", label: "Essentials" }
];

export function Header() {
  const { count, hydrated } = useCart();
  const { scrollY } = useScroll();
  const [isPinned, setIsPinned] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const delta = current - lastY;
    setIsPinned(current < 24 || delta < 0);
    setLastY(current);
  });

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        animate={{ y: isPinned ? 0 : -92 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b-2 border-ink/90 bg-bone/72 backdrop-blur-xl"
      >
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-8">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2 justify-self-start"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center border-2 border-ink bg-ink text-sm font-black text-white transition-transform group-hover:-translate-y-0.5">
              VR
            </span>
            <span className="truncate text-sm font-black uppercase tracking-normal sm:text-base">
              VIP Raiments
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 md:flex md:justify-self-center"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-16 items-center text-sm font-bold uppercase leading-none tracking-normal text-ink/72 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-self-end gap-1.5 sm:gap-2">
            <IconLink href="/account" label="Account" className="hidden sm:grid">
              <UserRound className="h-5 w-5" />
            </IconLink>
            <IconLink href="/cart" label="Cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center border border-ink bg-ink px-1 text-[10px] font-black text-white"
                suppressHydrationWarning
              >
                {hydrated ? count : 0}
              </span>
            </IconLink>
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="relative z-[70] grid h-10 w-10 place-items-center border-2 border-ink bg-white transition-colors md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-[75vw] max-w-xs flex-col border-l-2 border-ink bg-bone pt-20"
            >
              <div className="flex flex-col gap-1 px-5">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="border-b border-ink/10 py-4 text-lg font-black uppercase tracking-normal text-ink transition-colors hover:text-ink/50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto border-t-2 border-ink/10 p-5">
                <Link
                  href="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-sm font-bold uppercase text-ink/70 hover:text-ink/70"
                >
                  <UserRound className="h-5 w-5" />
                  Account
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-sm font-bold uppercase text-ink/70 hover:text-ink/70"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Cart ({hydrated ? count : 0})
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
