/**
 * Serves /events/:slug with that event's Open Graph tags already in the HTML.
 *
 * WhatsApp, Facebook and X preview scrapers do not run JavaScript, so tags
 * written by React are invisible to them — every shared event link previewed
 * as the generic site card. Worse, WhatsApp caches a preview for 24–72 hours
 * with no way to purge it, so a wrong first scrape sticks for days.
 *
 * This runs for every request rather than sniffing for crawler user agents:
 * a single WhatsApp share fires WhatsApp/2.x, facebookexternalhit and Facebot,
 * and Meta changes those. Serving the same bytes to everyone means there is no
 * list to keep up to date, no cloaking, and it can be tested with curl.
 *
 * The injected tags keep their `data-default` markers, so PageMeta strips them
 * as soon as React mounts and replaces them with its own — exactly as it does
 * with the static defaults in index.html.
 */

const PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID;
const DATASET = process.env.VITE_SANITY_DATASET || "production";
const API_VERSION = process.env.VITE_SANITY_API_VERSION || "2024-01-01";

const QUERY = `*[_type == "event" && slug.current == $slug][0]{
  title,
  summary,
  startDate,
  venue,
  city,
  "sector": sector->title,
  coverImage{ alt, asset, hotspot }
}`;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Meta descriptions are cut off around 160 characters, so cut cleanly. */
function clamp(text, max = 160) {
  const flat = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!flat) return "";
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).replace(/[\s,;:.-]+\S*$/, "")}…`;
}

/**
 * Build a 1200x630 crop straight from the asset reference, so the function
 * needs no Sanity SDK at all.
 *
 * Deliberately fm=jpg rather than auto=format: scraper support for WebP is
 * inconsistent, and a preview that fails to render is worse than a larger one.
 */
function coverImageUrl(coverImage) {
  const ref = coverImage?.asset?._ref;
  if (!ref || !PROJECT_ID) return null;

  const match = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!match) return null;
  const [, assetId, dimensions, extension] = match;

  const params = new URLSearchParams({
    w: "1200",
    h: "630",
    fit: "crop",
    fm: "jpg",
    q: "80",
  });

  // Respect the focal point the editor chose in the Studio.
  const hotspot = coverImage.hotspot;
  if (typeof hotspot?.x === "number" && typeof hotspot?.y === "number") {
    params.set("crop", "focalpoint");
    params.set("fp-x", String(hotspot.x));
    params.set("fp-y", String(hotspot.y));
  }

  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${assetId}-${dimensions}.${extension}?${params}`;
}

function describe(event) {
  if (event.summary) return clamp(event.summary);

  const when = event.startDate
    ? new Date(event.startDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Accra",
      })
    : null;
  const where = [event.venue, event.city].filter(Boolean).join(", ");

  return clamp(
    [event.title, when, where].filter(Boolean).join(" · ") ||
      "An event from Dormi Guide Events.",
  );
}

/**
 * Swap the site-level defaults for this event's tags, in place.
 *
 * They are replaced where they already sit rather than appended, because
 * WhatsApp stops parsing after the first few kilobytes of HTML.
 *
 * Exported for testing.
 */
export function injectEventMeta(html, { event, url, image }) {
  const title = `${event.title} — DG Events`;
  const description = describe(event);

  const tags = [
    `<title data-default>${escapeHtml(title)}</title>`,
    `<meta data-default name="description" content="${escapeHtml(description)}" />`,
    `<meta data-default property="og:site_name" content="Dormi Guide Events" />`,
    `<meta data-default property="og:type" content="article" />`,
    `<meta data-default property="og:locale" content="en_GB" />`,
    `<meta data-default property="og:url" content="${escapeHtml(url)}" />`,
    `<meta data-default property="og:title" content="${escapeHtml(title)}" />`,
    `<meta data-default property="og:description" content="${escapeHtml(description)}" />`,
    `<meta data-default property="og:image" content="${escapeHtml(image.url)}" />`,
    `<meta data-default property="og:image:width" content="1200" />`,
    `<meta data-default property="og:image:height" content="630" />`,
    `<meta data-default property="og:image:alt" content="${escapeHtml(image.alt)}" />`,
    `<meta data-default name="twitter:card" content="summary_large_image" />`,
    `<meta data-default name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta data-default name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta data-default name="twitter:image" content="${escapeHtml(image.url)}" />`,
  ].join("\n    ");

  const titleTag = /<title\b[^>]*\bdata-default\b[^>]*>[\s\S]*?<\/title>/i;
  const metaTag = /[ \t]*<meta\b[^>]*\bdata-default\b[^>]*>\s*/gi;

  // Remember where the block started so the replacement lands in the same
  // place, well inside the first few kilobytes.
  const anchor = html.search(/<(?:title|meta)\b[^>]*\bdata-default\b/i);
  if (anchor === -1) return html;

  const stripped = html.replace(titleTag, "").replace(metaTag, "");
  const insertAt = Math.min(anchor, stripped.length);

  return `${stripped.slice(0, insertAt)}${tags}\n    ${stripped.slice(insertAt)}`;
}

async function fetchEvent(slug) {
  const url = new URL(
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`,
  );
  url.searchParams.set("query", QUERY);
  url.searchParams.set("$slug", JSON.stringify(slug));
  url.searchParams.set("perspective", "published");

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Sanity responded ${response.status}`);

  const body = await response.json();
  if (body.error) throw new Error(body.error.description || "Sanity error");
  return body.result || null;
}

export default async function handler(req, res) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const origin = `${protocol}://${host}`;

  const slug = String(req.query?.slug || "");

  // Both requests start together. They were sequential, which put the Sanity
  // round trip end to end with the shell fetch and pushed the document
  // response past a second.
  //
  // The shell is /index.html, a real file — Vercel checks the filesystem
  // before rewrites, so this cannot loop back into this function.
  const [shellResult, eventResult] = await Promise.allSettled([
    fetch(`${origin}/index.html`).then((response) => {
      if (!response.ok) throw new Error(`shell responded ${response.status}`);
      return response.text();
    }),
    fetchEvent(slug),
  ]);

  if (shellResult.status === "rejected") {
    // Nothing sensible to serve without the shell.
    console.error("Could not load the app shell:", shellResult.reason);
    res.status(502).send("Temporarily unavailable");
    return;
  }
  const html = shellResult.value;

  if (eventResult.status === "rejected") {
    // Fail open: the CMS being unreachable must not take the page down. The
    // visitor gets a working SPA and the generic site preview.
    console.error("Could not load event for preview:", eventResult.reason);
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
    return;
  }
  const event = eventResult.value;

  if (!event) {
    // A real 404 so scrapers do not build a preview for a page that is not
    // there. The SPA still renders its own not-found screen from this body.
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(404).send(html);
    return;
  }

  const image = coverImageUrl(event.coverImage);
  const body = injectEventMeta(html, {
    event,
    url: `${origin}/events/${slug}`,
    image: image
      ? { url: image, alt: event.coverImage?.alt || event.title }
      : {
          url: `${origin}/og-default.png`,
          alt: "The Dormi Guide Events logo",
        },
  });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=86400",
  );
  res.status(200).send(body);
}
