import Link from "next/link";

const footerLinks = {
  Shop: [
    { href: "/products", label: "All Shirts" },
    { href: "/products?filter=t-shirts", label: "T-shirts" },
    { href: "/products?filter=pants", label: "Pants" },
  ],
  Help: [
    { href: "/about", label: "About Us" },
    { href: "/cart", label: "Your Cart" },
    { href: "/account", label: "Account" },
    { href: "/track", label: "Track Order" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-section sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-control bg-white text-xs font-bold text-ink">
              VR
            </span>
            <span className="text-sm font-bold uppercase tracking-tight">
              VIP Raiments
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Premium streetwear shirts built for first‑look buyers. Limited runs,
            no restocks.
          </p>
        </div>

        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="label-mono mb-4 text-white/30">
              {heading}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/30 sm:flex-row sm:px-6 lg:px-8">
          <span>&copy; {year} VIP Raiments. All rights reserved.</span>
          <span className="font-medium">Amrix Labs</span>
        </div>
      </div>
    </footer>
  );
}