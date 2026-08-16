// /robots.txt
//
// Served from a function so the Sitemap line can carry an absolute URL without
// anything being substituted at build time.
//
// Note what is NOT here: any Disallow covering /events. Meta's preview
// scrapers respect robots.txt, so blocking those paths would silently kill
// every WhatsApp link preview.

import { siteUrlFromRequest } from "../server/siteUrl.js";

export default async function handler(req, res) {
  const origin = siteUrlFromRequest(req.headers, process.env);

  // Vercel sets this to "preview" for branch and pull-request deployments.
  // Those must never end up in a search index competing with the real site.
  const isProduction =
    !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

  const lines = isProduction
    ? [
        "User-agent: *",
        "Allow: /",
        "",
        "# Internal endpoints. The public event pages live at /events/<slug>.",
        "Disallow: /api/",
        "",
        `Sitemap: ${origin}/sitemap.xml`,
        "",
      ]
    : [
        "# Preview deployment — kept out of search results.",
        "User-agent: *",
        "Disallow: /",
        "",
      ];

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  res.status(200).send(lines.join("\n"));
}
