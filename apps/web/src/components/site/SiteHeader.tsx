"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/integrations", label: "Integrations" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-fg bg-paper-bright/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link className="group flex flex-col gap-0.5 leading-none" href="/">
          <span className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
            SolAUDD
          </span>
          <span className="font-mono-ui text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
            Subscriptions · AUDD on Solana
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-6 text-sm font-semibold text-muted"
        >
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                className={`border-b-2 pb-0.5 transition-colors ${
                  active
                    ? "border-accent text-fg"
                    : "border-transparent hover:border-blue/35 hover:text-blue"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
