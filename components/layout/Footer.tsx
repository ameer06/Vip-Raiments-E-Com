import Link from "next/link";

const footerLinks = {
  Shop: [
    { href: "/products", label: "All Drops" },
    { href: "/products?filter=outerwear", label: "Outerwear" },
    { href: "/products?filter=essentials", label: "Essentials" },
  ],
  Help: [
    { href: "/cart", label: "Your Cart" },
    { href: "/account", label: "Account" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-ink/90 bg-ink text-bone">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center border-2 border-bone bg-electric-blue text-sm font-black text-white shadow-[3px_3px_0_#f4f2ed] transition-transform group-hover:-translate-y-0.5">
              VR
            </span>
            <span className="text-base font-black uppercase tracking-normal">
              VIP Raiments
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-bone/60">
            Premium streetwear drops built for first‑look buyers. Limited runs,
            no restocks.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-bone/40">
              {heading}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-bone/70 transition-colors hover:text-electric-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-bone/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-bone/40 sm:flex-row sm:px-6 lg:px-8">
          <span>&copy; {year} VIP Raiments. All rights reserved.</span>
          <span className="font-medium">Built with 🖤 in India</span>
        </div>
      </div>
    </footer>
  );
}
