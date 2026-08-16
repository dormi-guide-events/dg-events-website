/**
 * The site's own origin, with no trailing slash.
 *
 * Needed wherever an absolute URL is required — Open Graph tags and
 * Schema.org markup both reject relative ones. VITE_SITE_URL wins so that a
 * preview deployment still advertises the canonical domain.
 */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window === "undefined" ? "" : window.location.origin)
).replace(/\/+$/, "");

/** Absolute URL for a path on this site. */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
