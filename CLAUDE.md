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

**Event links get their own preview, from a function.** `/events/:slug` is
rewritten in `vercel.json` to `api/event-preview.js`, which fetches the event
from Sanity, injects its title, summary and cover into the shell's
`data-default` tags, and serves that. So a link shared on WhatsApp previews as
the event itself, and a newly published event is correct immediately — no
rebuild.

Things about it that are deliberate:

- **No user-agent sniffing.** One WhatsApp share fires `WhatsApp/2.x`,
  `facebookexternalhit` and `Facebot`, and Meta changes them. Everyone gets the
  same bytes, so there is no list to maintain and `curl` reproduces exactly
  what a scraper sees.
- **The injected tags keep `data-default`**, so `PageMeta` strips them on mount
  exactly as it does the static ones. Drop the marker and every event page ends
  up with two titles.
- **`fm=jpg`, not `auto=format`.** Scraper support for WebP is inconsistent and
  a preview that fails to render is worse than a larger one.
- **Tags are replaced in place, not appended** — WhatsApp stops parsing after
  the first few kilobytes.
- **It fails open.** If Sanity is unreachable the shell is served unchanged, so
  the page still works and only the preview falls back to the site default. An
  unknown slug returns a real 404.

WhatsApp caches a preview for 24–72 hours with no way to purge it, which is why
this runs at request time rather than at build time: a wrong first scrape would
stick for days.

Other routes still share as the generic site card. Sector pages could be added
to the same function; everything else is stable enough not to need it.

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

## Contact form

The form posts to `/api/contact`. The logic lives in `server/contact/`, which
knows nothing about any hosting platform: it takes plain values and returns
`{ status, body }`. `api/contact.js` is a thin Vercel adapter that reads the
request and writes the response — **if this moves to Cloudflare Pages, that
adapter is the only file to rewrite** (the shape is written out in a comment
at the top of it).

```
server/contact/index.js          orchestration
server/contact/validate.js       caps, validation, header sanitisation
server/contact/rateLimit.js      Upstash over REST
server/contact/mailers/          web3forms.js, resend.js — same interface
api/contact.js                   Vercel adapter (thin)
```

**The mailer is a seam.** `CONTACT_MAILER` picks the provider and nothing else
changes. It defaults to `web3forms`, which needs no DNS-verified sending
domain; switch to `resend` once DG Events own one, and set `RESEND_API_KEY`,
`CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`. Mail is delivered to their
existing inbox either way — no new mailbox.

**Web3Forms is called from the server, never the browser.** A Web3Forms key
embedded in a page is public, and anyone reading it could post straight to
their endpoint and skip every check below.

Defences, in the order they run: origin check → honeypot (reports success,
sends nothing) → hard length caps rejected before parsing → full re-validation
→ IP rate limit. Rate limiting **fails open** — a contact form that silently
stops accepting messages because a rate-limit store is down is worse than one
that lets an extra message through.

`name`, `email` and `subject` are stripped of CR, LF and U+2028/U+2029 before
they touch a Subject or Reply-To, or an attacker could append headers of their
own. Those regexes are built with `new RegExp` from escaped strings: U+2028 and
U+2029 are line terminators in JavaScript, so writing them raw inside a regex
literal is a syntax error.

Reply-To is the visitor so a reply just works; From is never the visitor, which
would fail SPF.

**The server-side variables have no `VITE_` prefix, deliberately.** Vite inlines
every `VITE_*` variable into the browser bundle, so a key named `VITE_ANYTHING`
is public. See `.env.example`.

The failure state shows the phone number from the `siteSettings` singleton. If
that document does not exist the line is dropped rather than guessed — never
hardcode a fallback number.

## Security headers, crawlers and structured data

Headers are set in `vercel.json` for `/(.*)`. The CSP is the fragile one, so
**anything added to the site has to be checked against it**:

| Directive | Why it is what it is |
|---|---|
| `script-src 'self'` | The build emits no inline scripts, so no `unsafe-inline` is needed. Keep it that way. |
| `style-src 'self' fonts.googleapis.com` | The Google Fonts stylesheet. |
| `style-src-attr 'unsafe-inline'` | Unavoidable: Framer Motion and `SanityImage`'s LQIP set style attributes. Scoped to attributes so inline `<style>` blocks stay banned. |
| `font-src 'self' fonts.gstatic.com` | The font files themselves. |
| `img-src 'self' data: cdn.sanity.io` | `data:` is the LQIP blur placeholder. |
| `connect-src 'self' *.api.sanity.io *.apicdn.sanity.io` | GROQ queries, and `/api/contact`. |

Adding a third-party script, analytics or an embedded map means adding to this
policy — and re-testing every route, because a CSP that breaks the site is
worse than no CSP.

`/sitemap.xml` and `/robots.txt` are **functions**, not static files, for the
same reason the link previews are: events are published long after a deploy,
and a build-time sitemap would never list them. `robots.txt` serves a blanket
`Disallow: /` when `VERCEL_ENV` is not `production`, so preview deployments
stay out of search results. It deliberately does **not** disallow `/events` —
Meta's preview scrapers respect robots.txt, so that would kill every WhatsApp
preview.

Schema.org markup is built in `src/lib/structuredData.js` and rendered by
`JsonLd`: `Organization` on the homepage, `Event` on event pages. `Event`
carries everything Google requires (name, startDate, location) plus most of
what it recommends. **`offers` is deliberately absent** — bookings happen by
phone, so there is no price or ticket URL, and inventing one would be worse
than omitting it.

## Accessibility and performance rules

**pink-500 is never small text.** `#E0417F` on off-white is 3.83:1 — below the
4.5:1 body-text minimum, and worse on `pink-100`. It is for fills, rules,
nodes, gradients, focus rings and display type 24px and over. Small text and
link hovers use purple-700 or purple-900. The active nav item is purple-700
with the pink gradient underline carrying the accent.

**Never layer a text colour on top of a button class.** `secondaryButton`
already sets `text-purple-700`; appending `text-off-white` does not win,
because both are single-class selectors and the generated stylesheet's order
decides, not the class attribute's. That shipped purple-700 text on a
purple-900 panel at 1.22:1. Use `secondaryButtonOnDark` instead, and add a
variant rather than an override next time.

**Interactive targets are at least 44x44.** Buttons use `py-3.5`, pills `py-3`,
icon buttons `h-11 w-11`.

**Loading skeletons must approximate the height of what they replace.** A short
skeleton under a long page makes the footer leap when content lands — that was
a 0.564 CLS on sector pages. The footer's sector column renders placeholder
rows while the request is in flight for the same reason.

**Fonts are self-hosted** in `public/fonts`, declared in `src/index.css`.
Google Fonts cost a render-blocking third-party stylesheet plus two extra
DNS/TLS handshakes. Inter is a variable font — one file covers 400/500/600, so
do not add per-weight files. Headings are `font-semibold`, because 600 is the
only Playfair weight loaded. The two latin subsets are preloaded in
`index.html`; `crossorigin` is required there even same-origin.

**Routes are code-split** in `src/App.jsx`, with every chunk prefetched on idle.
The split alone would trade a faster first paint for a blank flash on first
navigation; the prefetch buys both. Home and NotFound stay in the entry chunk.

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
