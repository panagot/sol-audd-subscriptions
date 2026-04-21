# Grant submission screenshots

PNG captures of the marketing shell (home), integration guide, and merchant dashboard at **1440×900** viewport, **full page** height.

| File | Route |
| --- | --- |
| `01-home-full.png` | `/` |
| `02-integrations-full.png` | `/integrations` |
| `03-dashboard-full.png` | `/dashboard` |

## Regenerate (after UI changes)

From the repo root, with nothing else using the chosen port:

```bash
cd apps/web
npm run build
npx next start -p 3456
```

In another terminal:

```bash
npx playwright@1.50.1 install chromium
npx playwright@1.50.1 screenshot --full-page --viewport-size=1440,900 http://localhost:3456/ docs/grant-screenshots/01-home-full.png
npx playwright@1.50.1 screenshot --full-page --viewport-size=1440,900 http://localhost:3456/integrations docs/grant-screenshots/02-integrations-full.png
npx playwright@1.50.1 screenshot --full-page --viewport-size=1440,900 http://localhost:3456/dashboard docs/grant-screenshots/03-dashboard-full.png
```

After deploying to Vercel, you can optionally re-run the same commands against your public URL instead of `localhost` so the captures match production.
