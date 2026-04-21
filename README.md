# AUDD Subscriptions (SolAUDD)

**Live demo:** [sol-audd-subscriptions-web.vercel.app](https://sol-audd-subscriptions-web.vercel.app/) · **Source:** [github.com/panagot/sol-audd-subscriptions](https://github.com/panagot/sol-audd-subscriptions)

## What this is

**SolAUDD helps you take recurring payments in Australian dollars on Solana**, using **AUDD** (Australia’s AUD-backed stablecoin) as the on-chain settlement asset.

In practice you get:

- A **merchant dashboard** to create subscription plans (monthly or yearly, amount in AUD).
- A **hosted checkout page** your customers open in the browser, connect a Solana wallet, and pay in AUDD.
- A **small embed script** so you can drop “subscribe” into a normal website or landing page without building payments from scratch.
- **HTTP APIs** if you prefer your own UI (mobile app, backend job, etc.).

Pricing is shown in **AUD**; each charge moves **AUDD** tokens on-chain. You can **self-host** the app (MIT license) and keep your own database and domain.

## Who it’s for

- **Merchants and creators** who want subscription billing without a closed SaaS lock-in.
- **Developers** who need a clear pattern: plans, checkout URL, payment verification, and optional platform fee.

## What’s included

| Area | What you get |
| --- | --- |
| **Plans** | Name, amount in AUD, monthly or yearly billing, optional extra lines on checkout (e.g. what’s included). |
| **Payments** | Customer pays AUDD per billing period; optional **platform fee** (basis points) to a treasury you configure. |
| **Embeds** | `widget.js` loads a checkout experience for a given plan id. |
| **APIs** | e.g. `GET /api/plans/[id]`, `POST /api/subscriptions/confirm` for custom flows. |
| **Data** | **SQLite + Prisma** by default so a single server can run the stack easily. |

Built with **Next.js**; includes an in-app **Integrations** guide (`/integrations`) for websites, SPAs, mobile WebViews, and more.

## Repository layout

- `apps/web` — Next.js app: marketing site, dashboard, `/embed/[planId]` checkout, APIs.
- `packages/widget` — build step that produces `apps/web/public/widget.js`.

## Quick start (developers)

```bash
cd apps/web
cp .env.example .env
# Set at least NEXT_PUBLIC_APP_URL to your public URL when deploying.
npm install
npx prisma migrate deploy
npm run dev
```

From the **repository root**, install and build the web app and widget bundle:

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

- `data-api` — public base URL of this app (no trailing slash).
- `data-plan` — plan id from the dashboard.

## Same deployment, many surfaces

| Surface | Idea |
| --- | --- |
| **Static sites / CMS** | Paste the widget snippet in HTML or a theme. |
| **Web apps** | Open `/embed/<planId>` in an iframe, new tab, or inject the script on a route. |
| **Mobile** | Open the embed URL in an in-app browser or WebView; or call the APIs from a native app. |
| **Custom backend** | Use the REST endpoints and your own UI; confirmation uses the same verification flow. |

More detail and copy-paste patterns: open **`/integrations`** on your deployment.

## Environment variables

See [`apps/web/.env.example`](apps/web/.env.example). Common settings:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public URL of this app (used in snippets and redirects). |
| `NEXT_PUBLIC_SOLANA_RPC` | Solana RPC endpoint (use a reliable provider in production). |
| `NEXT_PUBLIC_AUDD_MINT` | AUDD mint address on the cluster you use (mainnet default in the example). |
| `PLATFORM_TREASURY` | Optional Solana address that receives your platform fee (basis points) from each payment. Server-only; checkout reads it via `/api/platform`. |
| `DATABASE_URL` | SQLite database file path for Prisma. |

## License

MIT. See [LICENSE](LICENSE).
