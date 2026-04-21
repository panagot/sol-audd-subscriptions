import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integrations · AUDD Subscriptions",
  description:
    "Use AUDD subscription checkout on websites, SPAs, mobile apps, and custom backends: embed, WebView, or API.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto border border-fg bg-fg p-4 font-mono-ui text-[11px] leading-relaxed text-paper-bright sm:text-xs">
      {children.trim()}
    </pre>
  );
}

export default function IntegrationsPage() {
  return (
    <article className="prose-site mx-auto max-w-3xl pb-8">
      <p className="font-mono-ui text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
        Integration guide
      </p>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-[2.25rem]">
        Use AUDD subscriptions everywhere
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        This project is intentionally boring infrastructure: a{" "}
        <strong>hosted checkout</strong> (
        <code className="code-inline">/embed/[planId]</code>
        ), a tiny <strong>widget script</strong>, and <strong>HTTP APIs</strong> you can call from any
        client or server. Below are patterns that work for marketing sites, web apps, and mobile. All
        open source and self-hosted.
      </p>

      <nav className="not-prose mt-10 border border-fg bg-paper-bright p-5">
        <p className="font-mono-ui text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
          On this page
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
          <li>
            <a className="font-semibold text-fg hover:text-blue" href="#website-widget">
              Website widget
            </a>
          </li>
          <li>
            <a className="font-semibold text-fg hover:text-blue" href="#cms">
              CMS & landing pages
            </a>
          </li>
          <li>
            <a className="font-semibold text-fg hover:text-blue" href="#spa">
              SPAs & web apps
            </a>
          </li>
          <li>
            <a className="font-semibold text-fg hover:text-blue" href="#fullstack">
              Next.js & full-stack
            </a>
          </li>
          <li>
            <a className="font-semibold text-fg hover:text-blue" href="#mobile">
              Mobile apps
            </a>
          </li>
          <li>
            <a className="font-semibold text-fg hover:text-blue" href="#desktop">
              Desktop & Electron
            </a>
          </li>
          <li>
            <a className="font-semibold text-fg hover:text-blue" href="#api">
              APIs & custom flows
            </a>
          </li>
          <li>
            <a className="font-semibold text-fg hover:text-blue" href="#self-host">
              Self-hosting
            </a>
          </li>
        </ul>
      </nav>

      <h2 className="mt-14 scroll-mt-24 text-xl font-semibold text-fg" id="website-widget">
        1. Marketing websites: drop-in widget
      </h2>
      <p className="mt-3 text-muted">
        After you create a plan in the dashboard, paste a single script. The bundle in{" "}
        <code className="code-inline">public/widget.js</code> injects an <strong>iframe</strong>{" "}
        pointed at your deployment’s{" "}
        <code className="code-inline">/embed/&lt;planId&gt;</code> route. Wallet connection and AUDD
        transfer happen inside that origin.
      </p>
      <CodeBlock>{`<script
  src="https://YOUR_DOMAIN/widget.js"
  data-audd-widget
  data-plan="PLAN_ID_FROM_DASHBOARD"
  data-api="https://YOUR_DOMAIN"
  async
></script>`}</CodeBlock>

      <h2 className="mt-14 scroll-mt-24 text-xl font-semibold text-fg" id="cms">
        2. CMS & static site generators
      </h2>
      <p className="mt-3 text-muted">
        <strong>WordPress, Ghost, Webflow, Hugo, Astro:</strong> add the script in a custom HTML
        block, theme footer, or layout template. Use <code className="code-inline">data-api</code>{" "}
        for your self-hosted base URL so the iframe always loads from <em>your</em> checkout domain
        (important for cookies, CSP, and wallet UX).
      </p>

      <h2 className="mt-14 scroll-mt-24 text-xl font-semibold text-fg" id="spa">
        3. Single-page apps (React, Vue, Svelte, etc.)
      </h2>
      <p className="mt-3 text-muted">
        You have three common patterns. All use the same plan id and deployment URL:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
        <li>
          <strong className="text-fg">Iframe in a modal</strong>: set{" "}
          <code className="code-inline">src=YOUR_DOMAIN/embed/PLAN_ID</code> on a responsive iframe;
          listen for <code className="code-inline">postMessage</code> later if you add a completion
          channel (stretch goal).
        </li>
        <li>
          <strong className="text-fg">New tab / window</strong>:{" "}
          <code className="code-inline">window.open</code> the embed URL so the user’s wallet opens
          with fewer iframe restrictions on some browsers.
        </li>
        <li>
          <strong className="text-fg">Dynamic script injection</strong>: append the widget{" "}
          <code className="code-inline">&lt;script&gt;</code> when a “Subscribe” route mounts (works
          well with client-side routers).
        </li>
      </ul>

      <h2 className="mt-14 scroll-mt-24 text-xl font-semibold text-fg" id="fullstack">
        4. Full-stack frameworks (Next.js, Nuxt, Rails, etc.)
      </h2>
      <p className="mt-3 text-muted">
        Self-host this app as your “billing subdomain” (e.g.{" "}
        <code className="code-inline">pay.example.com</code>
        ), then deep-link from your product app. Your main site can stay on any stack. Only the
        checkout needs Solana RPC and the Prisma database.
      </p>

      <h2 className="mt-14 scroll-mt-24 text-xl font-semibold text-fg" id="mobile">
        5. Mobile apps (iOS, Android, React Native, Flutter)
      </h2>
      <p className="mt-3 text-muted">
        Wallets like Phantom are most reliable when they run in a{" "}
        <strong className="text-fg">system browser</strong> or a trusted in-app browser, not always
        inside a constrained WebView. Practical patterns:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
        <li>
          <strong className="text-fg">WebView / Chrome Custom Tabs / SFSafariViewController</strong>{" "}
          loading{" "}
          <code className="code-inline">https://YOUR_DOMAIN/embed/PLAN_ID</code>, simplest bridge between
          native shell and Solana wallet.
        </li>
        <li>
          <strong className="text-fg">Deep link out</strong>: open the embed URL in the default
          browser; return to the app with your own deep link after payment (you may extend the app
          with a redirect query param in future).
        </li>
        <li>
          <strong className="text-fg">Solana Mobile & wallet SDKs</strong>: for a fully native UX,
          reuse the same <strong className="text-fg">payment construction</strong> logic (AUDD
          mint, associated token accounts, transfer instructions) inside a native client; this repo’s{" "}
          <code className="code-inline">/api</code> routes show how the server confirms txs.
        </li>
      </ul>

      <h2 className="mt-14 scroll-mt-24 text-xl font-semibold text-fg" id="desktop">
        6. Desktop & Electron
      </h2>
      <p className="mt-3 text-muted">
        Point a <code className="code-inline">BrowserView</code> or embedded webview at the same{" "}
        <code className="code-inline">/embed/&lt;planId&gt;</code> URL. Keep the checkout on HTTPS
        and match your CSP to allow the wallet extension or in-window signing flow you prefer.
      </p>

      <h2 className="mt-14 scroll-mt-24 text-xl font-semibold text-fg" id="api">
        7. APIs for custom flows
      </h2>
      <p className="mt-3 text-muted">Build your own UI but reuse the rails:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
        <li>
          <code className="code-inline">GET /api/plans/[id]</code>: public plan metadata (merchant pubkey,
          amount, fee bps).
        </li>
        <li>
          <code className="code-inline">POST /api/subscriptions/confirm</code>: register a successful
          payment after the subscriber signs an on-chain AUDD transfer.
        </li>
      </ul>
      <p className="mt-4 text-muted">
        A billing cron, dunning emails, or internal admin tools can sit beside this. They only need your
        database and the same confirmation endpoint pattern.
      </p>

      <h2 className="mt-14 scroll-mt-24 text-xl font-semibold text-fg" id="self-host">
        8. Self-host checklist
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted">
        <li>
          Copy <code className="code-inline">.env.example</code> to <code className="code-inline">.env</code>{" "}
          and set <code className="code-inline">NEXT_PUBLIC_APP_URL</code> to your public origin.
        </li>
        <li>
          Run Prisma migrations and deploy the Next.js app + built{" "}
          <code className="code-inline">widget.js</code> (see repo <code className="code-inline">README</code>
          ).
        </li>
        <li>
          Use a reliable Solana RPC in production; optional{" "}
          <code className="code-inline">PLATFORM_TREASURY</code> if you charge a platform
          fee.
        </li>
      </ol>

      <div className="not-prose mt-14 flex flex-wrap gap-3">
        <Link className="btn-primary" href="/dashboard">
          Go to dashboard
        </Link>
        <Link className="btn-secondary" href="/">
          Back to home
        </Link>
      </div>
    </article>
  );
}
