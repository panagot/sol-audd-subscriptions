/** Public GitHub repository for this project. */
export const GITHUB_REPO_URL = "https://github.com/panagot/sol-audd-subscriptions";

/**
 * Canonical site origin for links and metadata. Set `NEXT_PUBLIC_APP_URL` in production
 * to your deployment URL (no trailing slash).
 */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "https://sol-audd-subscriptions-web.vercel.app";
}
