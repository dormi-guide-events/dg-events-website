/**
 * Per-page document title, description and social preview tags.
 *
 * React 19 hoists <title> and <meta> rendered anywhere in the tree into
 * <head>, and removes them again on unmount — so no helmet library is needed
 * and navigating away restores the defaults.
 *
 * NOTE: these tags are written by JavaScript at runtime. Crawlers that execute
 * JS (Google) see them; WhatsApp, Facebook and Twitter's preview scrapers do
 * NOT run JS and will only ever see the static index.html. Getting real link
 * previews needs the tags in the server response — see the note in CLAUDE.md.
 */

const SITE_NAME = "Dormi Guide Events";

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

      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:width" content="1200" />}
      {image && <meta property="og:image:height" content="630" />}
      {image && imageAlt && <meta property="og:image:alt" content={imageAlt} />}

      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={fullTitle} />
      {summary && <meta name="twitter:description" content={summary} />}
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
