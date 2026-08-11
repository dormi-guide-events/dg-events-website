# DG Events Website — Project Context

## What this is

Marketing website for **Dormi Guide Events (DG EVENTS)**, a Ghanaian event-led
organization founded in 2026. They run events across four sectors that serve
young Ghanaians: students, graduates, workers, and entrepreneurs.

The site's job is to explain who they are, showcase their four sectors, and
list upcoming and past events. Visitors **do not register on the site** — they
contact DG Events directly. No accounts, no payments, no attendee database.

## Stack

- **Vite + React** (JavaScript, not TypeScript)
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin, `@import "tailwindcss";`
  in `src/index.css`. There is no `tailwind.config.js` and none should be created
  unless we need custom theme extension.
- **React Router** for navigation
- **Framer Motion** for animation
- **Sanity** headless CMS for events, gallery, and team content
- **GitHub → Vercel**, auto-deploy on push to `main`

## Brand

Colours sampled directly from the official logo:

| Token | Hex | Use |
|---|---|---|
| `purple-900` | `#2E0057` | Darkest purple, footers, deep backgrounds |
| `purple-700` | `#400080` | **Primary brand purple** — headings, nav, primary buttons |
| `purple-500` | `#5A1A9E` | Lighter purple, hover states |
| `pink-500` | `#E0417F` | **Primary accent** — CTAs, highlights, active states |
| `pink-400` | `#F060A0` | Softer pink, gradients, secondary accents |
| `pink-100` | `#F7E4EE` | Tinted backgrounds, cards |
| `gold-500` | `#D8A010` | Sparing accent only — from the figures in the logo mark |
| `charcoal` | `#1C1B1F` | Body text |
| `grey-500` | `#6B6B70` | Secondary text |
| `off-white` | `#FBF9FB` | Page background |

**Gradient signature:** the logo runs purple → pink. Use that direction
(`#400080` → `#E0417F`) for hero accents and section dividers. Do not overuse it.

**Colour discipline:** purple and pink carry the brand. Gold appears rarely —
small accents only, never large fills. White space is part of the design.

## Typography

- **Headings:** an elegant serif, echoing the logo's serif wordmark.
  Playfair Display or Cormorant Garamond.
- **Body:** a clean, highly legible sans. Inter or DM Sans.
- Load only the weights actually used. Font files are a real cost on
  Ghanaian mobile data.

## Sitemap

```
/                     Home
/about                About — mission, story, core objectives, approach
/sectors              The four sectors overview
/sectors/students     Dormi Students Guide
/sectors/graduates    Dormi Graduates Guide
/sectors/workers      Dormi Workers Guide
/sectors/entrepreneurs Dormi Entrepreneur Guide
/events               Events listing — upcoming and past
/events/:slug         Individual event detail
/gallery              Photo gallery
/contact              Contact page and form
*                     404
```

## The four sectors (content source of truth)

1. **Dormi Students Guide** — Academic & talent discovery events.
   Career Path Conferences, Talent Showcases & Festivals, Technical & Craft Expos.
2. **Dormi Graduates Guide** — Transition & employment events.
   Job Readiness & Placement Fairs, Adulting & Life Planning Roundtables,
   Personal Branding & Tech Bootcamps.
3. **Dormi Workers Guide** — Corporate wellness & advancement events.
   Financial Stability Masterclasses, Workplace Wellness Retreats,
   Labor Rights Forums.
4. **Dormi Entrepreneur Guide** — Business acceleration & market events.
   Pitch Competitions & Investor Mixers, Business Model & Scaling Intensives,
   Leadership & Team Management Summits.

Core pillars across all four: youth participation, entrepreneurship,
quality education, leadership.

## Sanity CMS

Standalone Studio in `studio/`, JavaScript to match the frontend.

| | |
|---|---|
| Organisation | Dormi Guide Events (`o0B2bOnAx`) |
| Project | DG Events (`i2k116ix`) |
| Dataset | `production`, public |

Project ids are public identifiers, not secrets, so `i2k116ix` is committed in
`studio/env.js`. Run the Studio with `cd studio && npm run dev` (port 3333).
Redeploy the hosted schema after any schema edit: `npx sanity schema deploy`.

**Icons must be imported from their own subpath** — `@sanity/icons/Calendar`,
not `@sanity/icons`. v5 removed the root named exports and they now resolve to
`undefined` silently rather than failing.

### Content models

```
event
  title           string, required
  slug            slug, from title, required
  sector          reference → sector, required
  startDate       datetime, required
  endDate         datetime, optional — validated to fall after startDate
  venue           string
  city            string, default "Accra"
  coverImage      image with hotspot + alt text (alt required)
  summary         text, ~160 chars, used on cards and meta description
  description     portable text (rich body)
  contactNote     string — how to attend, e.g. "Call 053 259 2824 to reserve a seat"
  isFeatured      boolean — pins to homepage

sector
  title             string, required
  slug              slug, from title, required
  remit             string, required — short label, e.g. "Academic & talent
                    discovery". Shown on event cards and sector page headers.
  headline          string, optional — the bold line on the sector page
  purpose           text, optional — the paragraph under the headline
  shortDescription  text, required — a sentence or two on who it is for. Used
                    on the home selector, the sectors index and as meta
                    description.
  displayOrder      number, required — drives the student → graduate → worker →
                    entrepreneur progression the whole site is built around
  eventFormats      array of { name, description }, required, 1–6

teamMember
  name            string, required
  role            string, required
  photo           image with hotspot + alt text (alt required)
  bio             text — short
  displayOrder    number — lower first

galleryImage
  image           image with hotspot + alt text, both required
  caption         string, optional
  event           reference → event, optional
  date            date — sorts the gallery, newest first

siteSettings      singleton, fixed id "siteSettings"
  contactEmail    string, required, email-validated
  phone           string, required
  address         text
  socialLinks     array of { platform, url }
```

Upcoming vs past is derived from `startDate` compared to now. It is never a
manually-set field — that would rot the moment the client forgets to update it.

`eventFormats` allows 1–6 rather than exactly 3. Every sector runs three today,
but that describes the current content, not a rule: locking it would stop a
half-drafted sector saving or a fourth format ever being added.

### How the frontend reads it

- `src/lib/sanity.js` builds the read-only client and the image URL builder.
  **Never add a token.** The dataset is public and the site only ever reads,
  so drafts are unreachable by construction.
- **All GROQ lives in `src/lib/queries.js`** — never inline in a component.
- `src/lib/events.js` and `src/lib/sectors.js` are the data-access seam.
  Sectors are cached as an in-flight promise, so the header, footer and page
  body share one request.
- Sector accent colours, step numbers and the desktop staircase offsets are
  **presentation, not content** — they live in `src/lib/sectorTheme.js` and are
  indexed by position in the progression, so reordering sectors in the CMS
  moves the colour ramp with them.
- Every fetch renders four states: loading, ready, empty and error. The empty
  state is a designed component (`EmptyState`), never a blank div — this site
  will genuinely have stretches with no upcoming events.
- Images go through `SanityImage`, which emits a width-based `srcset` with
  `auto=format` (WebP where supported) and an LQIP blur placeholder. Ghanaian
  mobile data is a real cost; do not drop in a bare `<img src>`.

- Rich text renders through `PortableText`, never `dangerouslySetInnerHTML`.
  Link hrefs are checked against an allowlist of schemes first — an editor can
  paste `javascript:` into a link field otherwise.

### Icons and social previews

Everything in `public/` is generated from `src/assets/logo.jpeg` — favicon.ico
(16/32/48), `apple-touch-icon.png`, `icon-192`/`icon-512`, a maskable 512 for
Android, and `og-default.png` at 1200x630. The icons crop to **just the
circular DG monogram**; the wordmark is illegible below about 64px. If the logo
is ever replaced, regenerate rather than hand-cropping.

`index.html` carries site-level `<title>`, description and OG/Twitter tags, all
marked `data-default`. `PageMeta` deletes those on mount and replaces them with
per-page equivalents, because React 19 only appends — leave the marker off and
every page ends up with two titles.

`og:image` and `og:url` must be absolute, so `index.html` uses
`%VITE_SITE_URL%`, substituted by Vite at build time. **Set `VITE_SITE_URL` in
Vercel** or the production preview will point at whatever the fallback says.

**Per-page previews still are not real.** The static block is the only thing
WhatsApp, Facebook and X ever see, because their scrapers do not run
JavaScript — so a shared `/events/some-event` link shows the generic site card
rather than that event's cover. Fixing it needs prerendering of the event
routes, or a Vercel edge middleware that injects tags for crawler user-agents.

Config lives in `.env` as `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET` and
`VITE_SANITY_API_VERSION`, with `.env.example` committed as the template.
These are public values, but they stay out of source so the project can be
repointed without a code change.

**New origins need a CORS entry** or the browser is blocked, even on a public
dataset: `cd studio && npx sanity cors add https://your-domain --no-credentials`.
Use `--no-credentials` — the site sends no token and should not be allowed to.

### Studio conventions

- Field labels are plain English for someone who runs an events organisation,
  not a CMS — "Web address" not "slug", "Photo description" not "alt text".
  Validation messages say what to do, not what went wrong.
- Document list order follows how often an editor touches each type:
  Events, Gallery, Team, Sectors, then Site settings.
- Seed the four sectors with `cd studio && npm run seed`. Fixed document ids
  (`sector-students` and so on) keep it idempotent and referenceable.

## Conventions

- **Mobile-first.** Write base styles for small screens, then `md:` and `lg:`.
- **Components** live in `src/components/`, **pages** in `src/pages/`.
- One component per file, named exports matching the filename.
- Tailwind utilities directly in JSX. No separate CSS files beyond `index.css`.
- Every image needs meaningful `alt` text.
- Animations must respect `prefers-reduced-motion`.
- Never hardcode event data into components — it always comes from Sanity.

## Security rules

- **No secrets in this repository. It is public.**
- All keys live in Vercel environment variables.
- The Sanity token used by the frontend is **read-only**. Never a write token.
- Contact form input is validated and sanitised server-side.
- Never render CMS rich text with `dangerouslySetInnerHTML` without sanitising.

## Tone of the copy

Confident and warm. This is an organization about unlocking potential in young
Ghanaians — the writing should feel energetic and respectful, never corporate
filler. Ghanaian English spelling conventions (British: "organisation",
"programme", "centre").
