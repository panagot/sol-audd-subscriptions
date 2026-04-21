"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GITHUB_REPO_URL } from "@/lib/site-urls";

const nav = [
  { href: "/", label: "Home" },
  { href: "/integrations", label: "Integrations" },
  { href: "/dashboard", label: "Dashboard" },
];

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.866-.013-1.7-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
        fillRule="evenodd"
      />
    </svg>
  );
}

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
        <div className="flex items-center gap-5 sm:gap-8">
          <nav
            aria-label="Primary"
            className="flex items-center gap-5 text-sm font-semibold text-muted sm:gap-6"
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
          <a
            aria-label="View source on GitHub"
            className="inline-flex items-center gap-1.5 rounded border border-line bg-paper-bright px-2.5 py-1.5 text-xs font-semibold text-fg shadow-sm transition-colors hover:border-blue hover:text-blue sm:px-3"
            href={GITHUB_REPO_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubMark className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
