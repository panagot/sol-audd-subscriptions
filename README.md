# AUDD Subscriptions (SolAUDD)

Open-source **AUDD** subscription checkout on **Solana**: a merchant dashboard to create plans, a **small embeddable widget** for the web, and documented patterns for **SPAs, mobile shells, and custom backends**.

## Features

- Plans priced in **AUD** / month, settled in **AUDD** (SPL).
- Optional **platform fee** (basis points) sent to `NEXT_PUBLIC_PLATFORM_TREASURY`.
- **Embeddable widget** (`public/widget.js`) that inserts a checkout iframe.
- **Public HTTP APIs** (`GET /api/plans/[id]`, `POST /api/subscriptions/confirm`) for bespoke flows.
- **SQLite + Prisma** for easy self-hosting.
- In-app **Integrations** guide (run locally: `/integrations`) covering marketing sites, CMS, SPAs, Next.js, mobile WebViews, Electron, and API-only usage.

## Repo layout

- `apps/web`: Next.js app (dashboard, `/embed/[planId]`, APIs).
- `packages/widget`: Vite build that outputs `apps/web/public/widget.js`.

## Quick start

```bash
cd apps/web
cp .env.example .env
# Set NEXT_PUBLIC_APP_URL to your public origin (e.g. http://localhost:3000)
npm install
npx prisma migrate dev --name init
npm run dev
```

From the repo root, build everything (including the widget bundle):

```bash
npm install
npm run build
```

## Embed on your site

After you create a plan in `/dashboard`, copy the snippet. It looks like:

```html
<script
  src="https://YOUR_DEPLOYMENT/widget.js"
  data-audd-widget
  data-plan="PLAN_ID"
  data-api="https://YOUR_DEPLOYMENT"
  async
></script>
```

- `data-api`: public base URL of this app (no trailing slash).
- `data-plan`: plan id from the dashboard.

## Beyond marketing websites

The same deployment supports:

| Surface | Idea |
| --- | --- |
| **Static / CMS sites** | Paste the widget script in a theme or HTML block. |
| **Web apps (React, Vue, …)** | Load `/embed/<planId>` in a modal iframe, new tab, or inject the script on a route. |
| **Mobile (iOS / Android / RN)** | Open the embed URL in SFSafariViewController, Custom Tabs, or a WebView; or build native Solana txs using the same mint + confirmation pattern. |
| **Desktop / Electron** | Point a `BrowserView` at `/embed/<planId>`. |
| **Custom backends** | Call the REST endpoints and drive your own UI; confirm payments with the existing verification flow. |

See the **Integrations** page in the app (`/integrations`) for copy-paste snippets and a self-host checklist.

## Environment

See [`apps/web/.env.example`](apps/web/.env.example). Important:

- `NEXT_PUBLIC_AUDD_MINT`: AUDD mint on Solana (mainnet default in example).
- `NEXT_PUBLIC_SOLANA_RPC`: RPC endpoint (use a paid provider for production).
- `NEXT_PUBLIC_PLATFORM_TREASURY`: optional pubkey receiving fee bps from plans.
- `DATABASE_URL`: SQLite file path for Prisma.

## License

MIT. See [LICENSE](LICENSE).

## Disclaimer

This software is not financial or legal advice. Integrations with AUDD and Solana carry risk; test on devnet and review custody and compliance for your jurisdiction.
