/**
 * The site's public origin, with no trailing slash.
 *
 * VITE_SITE_URL wins when it is set, so a preview deployment still advertises
 * the canonical domain rather than its own throwaway hostname. Falls back to
 * the request's own host, which keeps this working before anyone configures
 * anything.
 */
export function siteUrlFromRequest(headers = {}, env = {}) {
  if (env.VITE_SITE_URL) return env.VITE_SITE_URL.replace(/\/+$/, "");

  const host = headers["x-forwarded-host"] || headers.host;
  if (!host) return "";

  const protocol = headers["x-forwarded-proto"] || "https";
  return `${protocol}://${host}`;
}
