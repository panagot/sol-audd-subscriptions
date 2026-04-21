/**
 * Use the object form so Next.js accepts this config (webpack + next/font).
 * Pin Tailwind to v3 via root `package.json` overrides so `tailwindcss` stays the classic PostCSS plugin, not v4.
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
