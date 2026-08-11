import { useEffect } from "react";

/**
 * Per-page document title, description and social preview tags.
 *
 * React 19 hoists <title> and <meta> rendered anywhere in the tree into
 * <head>, and removes them again on unmount — so no helmet library is needed.
 *
 * index.html carries a matching set of site-level defaults marked
 * `data-default`, because WhatsApp, Facebook and X preview scrapers never run
 * JavaScript and would otherwise see a page with no title at all. React will
 * not replace those — it only appends — so the first PageMeta to mount clears
 * them out, leaving exactly one of each tag for anything that does run JS.
 *
 * NOTE: per-page tags are still written at runtime, so a scraper hitting
 * /events/some-event gets the site-level default preview rather than that
 * event's. Fixing that properly needs prerendering — see CLAUDE.md.
 */

const SITE_NAME = "Dormi Guide Events";

// Absolute, because preview scrapers will not resolve a relative og:image.
const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (typeof window === "undefined" ? "" : window.location.origin);

// Pages without artwork of their own fall back to the logo card. Without this
// they would have no og:image at all once the static defaults are cleared.
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;
const DEFAULT_IMAGE_ALT = "The Dormi Guide Events logo";

/** Meta descriptions are cut off around 160 characters, so cut cleanly. */
function clamp(text, max = 160) {
  if (!text) return undefined;
  const flat = String(text).replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).replace(/[\s,;:.-]+\S*$/, "")}…`;
}

export function PageMeta({
  title,
  description,
  image,
  imageAlt,
  type = "website",
}) {
  const fullTitle = `${title} — DG Events`;
  const summary = clamp(description);
  const url = typeof window === "undefined" ? undefined : window.location.href;
  const ogImage = image || DEFAULT_IMAGE;
  const ogImageAlt = (image ? imageAlt : DEFAULT_IMAGE_ALT) || DEFAULT_IMAGE_ALT;

  // Runs after React has already committed its own tags, so there is never a
  // moment with no title. A no-op on every mount after the first.
  useEffect(() => {
    for (const node of document.head.querySelectorAll("[data-default]")) {
      node.remove();
    }
  }, []);

  return (
    <>
      <title>{fullTitle}</title>
      {summary && <meta name="description" content={summary} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {summary && <meta property="og:description" content={summary} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:locale" content="en_GB" />

      {/* Both the event covers and the fallback card are rendered at 1200x630. */}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {summary && <meta name="twitter:description" content={summary} />}
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
