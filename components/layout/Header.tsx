"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/products", label: "Shirts" },
  { href: "/products?filter=t-shirts", label: "T-shirts" },
  { href: "/products?filter=pants", label: "Pants" }
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
        animate={{ y: isPinned ? 0 : -72 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-ink/10 bg-white/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="grid h-8 w-8 place-items-center rounded-control bg-ink text-xs font-bold text-white">
              VR
            </span>
            <span className="text-sm font-bold uppercase tracking-tight sm:text-base">
              VIP Raiments
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 md:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-16 items-center text-sm font-medium text-ink/60 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <IconLink href="/account" label="Account" className="hidden sm:grid">
              <UserRound className="h-4 w-4" />
            </IconLink>
            <IconLink href="/cart" label="Cart" className="relative">
              <ShoppingBag className="h-4 w-4" />
              <span
                className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] font-bold text-white"
                suppressHydrationWarning
              >
                {hydrated ? count : 0}
              </span>
            </IconLink>
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="relative z-[70] grid h-9 w-9 place-items-center rounded-control border border-ink/10 bg-white md:hidden"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            className="fixed inset-0 z-[60] bg-ink/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-[75vw] max-w-xs flex-col border-l border-ink/10 bg-white pt-20"
            >
              <div className="flex flex-col gap-1 px-5">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="border-b border-ink/5 py-4 text-base font-semibold text-ink transition-colors hover:text-ink/60"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto border-t border-ink/10 p-5">
                <Link
                  href="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-ink/60 hover:text-ink"
                >
                  <UserRound className="h-4 w-4" />
                  Account
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-ink/60 hover:text-ink"
                >
                  <ShoppingBag className="h-4 w-4" />
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
        "grid h-9 w-9 place-items-center rounded-control border border-ink/10 bg-white text-ink/60 transition-colors hover:bg-surface hover:text-ink",
        className
      )}
    >
      {children}
    </Link>
  );
}