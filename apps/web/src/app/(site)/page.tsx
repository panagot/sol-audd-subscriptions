import Link from "next/link";
import { GITHUB_REPO_URL } from "@/lib/site-urls";

const pillars = [
  {
    n: "01",
    title: "Australian dollar, on-chain",
    body: "Plans are quoted in AUD and settled in AUDD, a fully backed AUD stablecoin on Solana, suited to real-world commerce and subscriptions.",
  },
  {
    n: "02",
    title: "Epoch billing, verified",
    body: "Each period, subscribers approve an AUDD transfer. Your backend verifies the transaction and flips access: transparent and auditable.",
  },
  {
    n: "03",
    title: "Embeds & APIs",
    body: "Ship with the drop-in widget and hosted checkout, or call the same HTTP APIs from web apps, mobile shells, or your own billing jobs.",
  },
];

const surfaces = [
  {
    title: "Marketing & content sites",
    desc: "One script tag; the widget loads a checkout iframe from your deployment.",
    tag: "HTML · CMS",
  },
  {
    title: "Web applications",
    desc: "Modal iframe, new tab, or in-app browser. Same /embed/[plan] URL everywhere.",
    tag: "React · Vue · Next.js",
  },
  {
    title: "Mobile apps",
    desc: "WebView / Custom Tabs / system browser; or native Solana txs with the same confirm API.",
    tag: "iOS · Android · RN",
  },
];

export default function Home() {
  return (
    <div className="space-y-24 sm:space-y-32">
      <section className="grid gap-12 border-b-2 border-fg pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-end lg:gap-16">
        <div className="space-y-8">
          <p className="font-mono-ui text-[11px] font-medium uppercase tracking-[0.32em] text-muted">
            Open infrastructure · MIT · self host
          </p>
          <h1 className="font-display text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl sm:leading-[1.02]">
            Recurring revenue in <span className="text-accent">AUDD</span>{" "}
            <span className="italic text-blue">priced in dollars</span>, settled on Solana.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            Merchant dashboard, optional platform fee, on-chain settlement, and a tiny embed you run
            on your own domain. Built for operators who want a ledger they can read, not a black
            box.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link className="btn-primary" href="/dashboard">
              Merchant dashboard
            </Link>
            <Link className="btn-secondary" href="/integrations">
              Integration guide
            </Link>
            <a
              className="btn-ghost px-1"
              href="https://www.audd.digital/"
              rel="noreferrer"
              target="_blank"
            >
              About AUDD
            </a>
          </div>
        </div>

        <aside className="card-surface font-mono-ui text-[11px] leading-relaxed text-muted">
          <div className="border-b border-line bg-paper-bright px-4 py-3 text-fg">
            <span className="block text-[10px] uppercase tracking-[0.24em]">Instrument</span>
            <span className="mt-1 block text-sm font-medium text-blue">AUDD · SPL</span>
          </div>
          <dl className="space-y-3 px-4 py-4">
            <div className="flex justify-between gap-4 border-b border-dashed border-line pb-2">
              <dt>Billing</dt>
              <dd className="text-right text-fg">Epoch (monthly)</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-dashed border-line pb-2">
              <dt>Quote</dt>
              <dd className="text-right text-fg">AUD</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Settlement</dt>
              <dd className="text-right text-fg">On-chain</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section>
        <div className="mb-10 max-w-2xl border-l-4 border-blue pl-5">
          <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">Why this exists</h2>
          <p className="mt-2 text-muted">
            Three primitives: stable denomination, verifiable payment, portable integration.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((p) => (
            <div className="card-surface p-6" key={p.title}>
              <p className="font-mono-ui text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
                {p.n}
              </p>
              <h3 className="font-display mt-3 text-lg font-semibold text-fg">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              Same rails, many surfaces
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              The checkout URL and APIs do not care whether the user arrived from a landing page, a
              logged-in app, or a phone WebView.
            </p>
          </div>
          <Link className="font-mono-ui text-xs font-semibold uppercase tracking-[0.2em] text-blue hover:underline" href="/integrations">
            Full write-up →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {surfaces.map((s) => (
            <article className="card-surface flex flex-col p-6" key={s.title}>
              <span className="font-mono-ui text-[10px] font-medium uppercase tracking-[0.28em] text-blue">
                {s.tag}
              </span>
              <h3 className="font-display mt-4 text-xl font-semibold text-fg">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-2 border-blue/35 bg-paper-bright p-8 sm:p-10">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono-ui text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
              Open source
            </p>
            <h2 className="font-display text-2xl font-semibold leading-tight text-fg sm:text-3xl">
              Ship it under your name
            </h2>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              One MIT-licensed codebase: Next.js app, Prisma and SQLite, Solana wallet checkout, and a
              small widget you can embed anywhere. Fork it, deploy it on your domain, and skip the
              roadmap deck.
            </p>
          </div>
          <div className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-3 sm:overflow-x-auto sm:pb-1">
            <a
              className="btn-primary w-full justify-center sm:w-auto sm:shrink-0"
              href={GITHUB_REPO_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              View on GitHub
            </a>
            <Link className="btn-secondary w-full justify-center sm:w-auto sm:shrink-0" href="/dashboard">
              Open dashboard
            </Link>
            <Link
              className="btn-secondary w-full justify-center sm:w-auto sm:shrink-0"
              href="/integrations#self-host"
            >
              Self-host checklist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
