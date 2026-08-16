// /sitemap.xml
//
// Built at request time rather than at build time, for the same reason the
// link previews are: events are published in the CMS long after a deploy, and
// a sitemap that only lists what existed at build time would never show them.

import { siteUrlFromRequest } from "../server/siteUrl.js";

const PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID;
const DATASET = process.env.VITE_SANITY_DATASET || "production";
const API_VERSION = process.env.VITE_SANITY_API_VERSION || "2024-01-01";

// Routes that exist regardless of what is in the CMS.
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly" },
  { path: "/about", changefreq: "monthly" },
  { path: "/sectors", changefreq: "monthly" },
  { path: "/events", changefreq: "daily" },
  { path: "/gallery", changefreq: "weekly" },
  { path: "/contact", changefreq: "yearly" },
];

const QUERY = `{
  "sectors": *[_type == "sector" && defined(slug.current)] | order(displayOrder asc) {
    "slug": slug.current, _updatedAt
  },
  "events": *[_type == "event" && defined(slug.current)] | order(startDate desc) {
    "slug": slug.current, _updatedAt
  }
}`;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry({ loc, lastmod, changefreq }) {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function fetchContent() {
  if (!PROJECT_ID) return { sectors: [], events: [] };

  const url = new URL(
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`,
  );
  url.searchParams.set("query", QUERY);
  url.searchParams.set("perspective", "published");

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Sanity responded ${response.status}`);

  const body = await response.json();
  if (body.error) throw new Error(body.error.description || "Sanity error");
  return body.result || { sectors: [], events: [] };
}

export default async function handler(req, res) {
  const origin = siteUrlFromRequest(req.headers, process.env);

  let content = { sectors: [], events: [] };
  try {
    content = await fetchContent();
  } catch (error) {
    // Still serve the static routes rather than a 500 — a partial sitemap is
    // considerably more use to a crawler than an error page.
    console.error("Sitemap could not load CMS content:", error.message);
  }

  const entries = [
    ...STATIC_ROUTES.map((route) => ({
      loc: `${origin}${route.path}`,
      changefreq: route.changefreq,
    })),
    ...(content.sectors || []).map((sector) => ({
      loc: `${origin}/sectors/${sector.slug}`,
      lastmod: sector._updatedAt,
      changefreq: "monthly",
    })),
    ...(content.events || []).map((event) => ({
      loc: `${origin}/events/${event.slug}`,
      lastmod: event._updatedAt,
      changefreq: "weekly",
    })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(urlEntry),
    "</urlset>",
  ].join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  res.status(200).send(xml);
}
