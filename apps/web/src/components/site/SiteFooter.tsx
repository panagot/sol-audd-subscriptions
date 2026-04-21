import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-fg bg-paper-bright">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-md space-y-3">
          <p className="font-mono-ui text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
            Open source
          </p>
          <p className="font-display text-lg font-semibold text-fg">Self-hosted checkout</p>
          <p className="text-sm leading-relaxed text-muted">
            Run your own app and database. MIT licensed: fork, audit, and deploy under your brand.
            AUDD is Australia’s digital dollar stablecoin on Solana; review custody and compliance for
            your jurisdiction.
          </p>
        </div>
        <div className="flex min-w-[12rem] flex-col gap-3 text-sm font-semibold">
          <span className="font-mono-ui text-[10px] uppercase tracking-[0.28em] text-muted">
            Links
          </span>
          <Link
            className="text-fg underline decoration-neutral-400 underline-offset-4 hover:text-blue"
            href="/integrations"
          >
            Integration examples
          </Link>
          <a
            className="text-fg underline decoration-neutral-400 underline-offset-4 hover:text-blue"
            href="https://www.audd.digital/"
            rel="noreferrer"
            target="_blank"
          >
            AUDD · Australian Digital Dollar
          </a>
          <a
            className="text-fg underline decoration-neutral-400 underline-offset-4 hover:text-blue"
            href="https://explorer.solana.com/address/AUDDttiEpCydTm7joUMbYddm72jAWXZnCpPZtDoxqBSw"
            rel="noreferrer"
            target="_blank"
          >
            AUDD mint (explorer)
          </a>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center font-mono-ui text-[11px] text-muted">
        Not financial or legal advice. Software provided as-is.
      </div>
    </footer>
  );
}
