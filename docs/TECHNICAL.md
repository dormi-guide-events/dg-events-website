# DG Events — technical notes

For whoever picks this up next. `CLAUDE.md` in the repository root is the
authoritative record of *why* things are the way they are, and is worth reading
before changing anything. This file is the orientation: what the pieces are,
where they live, and what is still outstanding.

---

## Stack

| | |
|---|---|
| Frontend | Vite + React 19, **JavaScript, not TypeScript** |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`. No `tailwind.config.js` — the theme lives in `@theme` in `src/index.css` |
| Routing | React Router 7, client-side, code-split per route |
| Animation | Framer Motion |
| Content | Sanity (headless CMS), standalone Studio in `studio/` |
| Rich text | `@portabletext/react` |
| Hosting | Vercel, auto-deploy from GitHub `main` |
| Linting | oxlint (`npm run lint`) |

Nothing is server-rendered. The site is a static bundle plus a handful of
Vercel functions.

---

## Repository layout

```
index.html              app shell; carries the static meta defaults
vercel.json             security headers + rewrites (order matters)

api/                    Vercel functions
  contact.js            thin adapter -> server/contact
  event-preview.js      serves /events/:slug with per-event OG tags
  sitemap.js            /sitemap.xml, built from live CMS content
  robots.js             /robots.txt

server/                 platform-neutral server code (no Vercel APIs)
  contact/              validation, rate limiting, mailer seam
  siteUrl.js

src/
  components/           one component per file, named exports
  pages/                one per route
  hooks/                useAsyncData, useSectors
  lib/                  sanity client, GROQ queries, data access, helpers
  assets/               logo.jpeg (master), logo-192.png (used by the site)
  index.css             @font-face, brand tokens, base layer

public/                 favicons, app icons, og-default.png, fonts/, manifest
studio/                 Sanity Studio (its own package.json)
  schemaTypes/          the five content models
  seed/                 sectors.ndjson, events.ndjson
docs/                   this file and HANDOVER.md
```

**`src/lib` is the seam.** All GROQ lives in `src/lib/queries.js`; components
never contain queries. `src/lib/events.js`, `sectors.js`, `gallery.js` and
`settings.js` are the only things that talk to Sanity.

---

## Sanity project

| | |
|---|---|
| Organisation | Dormi Guide Events — `o0B2bOnAx` |
| Project | DG Events — `i2k116ix` |
| Dataset | `production`, **public** |
| Studio | `cd studio && npm run dev` → http://localhost:3333 |

Project ids and dataset names are public identifiers, not secrets, which is why
`i2k116ix` is committed.

**The frontend has no token and must never have one.** The dataset is public and
the site only ever reads, so drafts are unreachable by construction rather than
by policy.

### Content models
Five types: `event`, `sector`, `teamMember`, `galleryImage`, `siteSettings`
(a singleton with a fixed id). Field-by-field detail is in `CLAUDE.md`.

Two rules worth knowing before you touch the schema:

- **Icons must be imported from their own subpath** — `@sanity/icons/Calendar`,
  not `@sanity/icons`. v5 removed the root named exports; a root import
  silently resolves to `undefined` rather than failing, and `sanity schema
  validate` still passes.
- **Redeploy the hosted schema after any schema edit**: `npx sanity schema
  deploy`.

### Seeding
```bash
cd studio && npm run seed          # the four sectors
cd studio && npm run seed:events   # four placeholder events (optional)
```
Both use fixed document ids, so re-running updates rather than duplicates.

### CORS
A new origin cannot read the dataset from a browser until it is allowed, even
though the dataset is public:

```bash
cd studio && npx sanity cors add https://your-domain --no-credentials
```

Use `--no-credentials` — the site sends no token and should not be permitted to.
Currently allowed: `localhost:3333`, `localhost:5173`, `localhost:5174`.
**The production domain still needs adding.**

---

## Environment variables

Local values go in `.env` (git-ignored). `.env.example` is the committed
template. The same variables must be set in Vercel.

### Public — safe in the browser
Vite inlines anything prefixed `VITE_` into the client bundle.

| Variable | Purpose |
|---|---|
| `VITE_SANITY_PROJECT_ID` | `i2k116ix` |
| `VITE_SANITY_DATASET` | `production` |
| `VITE_SANITY_API_VERSION` | `2024-01-01` |
| `VITE_SITE_URL` | Public origin, no trailing slash. Substituted into `index.html` for `og:image`/`og:url`, which must be absolute. |

### Secret — server only
**These deliberately have no `VITE_` prefix.** A key named `VITE_ANYTHING` is
public. They are read by `api/contact.js` via `process.env`.

| Variable | Purpose |
|---|---|
| `CONTACT_MAILER` | `web3forms` (default) or `resend` |
| `WEB3FORMS_ACCESS_KEY` | Web3Forms key, registered against DG Events' inbox |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | For Resend, once a DNS-verified sending domain exists |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | IP rate limiting |

---

## Deploys

GitHub → Vercel, automatic on push to `main`. Repo:
`https://github.com/dormi-guide-events/dg-events-website`.

```bash
npm run dev      # vite dev server
npm run build    # production build into dist/
npm run lint     # oxlint
```

There is no test suite. Verification through this project has been done by
driving the built site in a browser and by Lighthouse.

### `vercel.json` — read before editing
Two sections, both load-bearing.

**Rewrites, in order.** The order is the behaviour:
```
/sitemap.xml      -> /api/sitemap
/robots.txt       -> /api/robots
/events/:slug     -> /api/event-preview?slug=:slug
/(.*)             -> /index.html          (SPA catch-all, must be last)
```
Vercel checks the filesystem before applying rewrites, which is why
`api/event-preview.js` can safely fetch `/index.html` for the app shell without
looping.

**Do not add a `comment` property** to any entry. Vercel's schema rejects
unknown keys and the whole deploy fails.

**Headers.** The CSP is the fragile one. It currently allows only `'self'` plus
`cdn.sanity.io` for images and `*.api.sanity.io` / `*.apicdn.sanity.io` for
requests. `script-src` has no `'unsafe-inline'` because the build emits no
inline scripts — keep it that way. `style-src-attr 'unsafe-inline'` is
unavoidable: Framer Motion and the image blur placeholder set style attributes.

**Anything third-party you add — analytics, a map, a chat widget — needs a CSP
entry, and every route must be re-tested afterwards.** A CSP that breaks the
site is worse than no CSP.

### Local verification without a Vercel login
`vercel dev` needs authentication. Everything in this project was verified with
a small Node harness that mimics Vercel's pipeline — filesystem first, then
rewrites, applying the real headers read out of `vercel.json`. If you need it
again it is about 100 lines: serve `dist/`, route `/api/*` to the matching file
with a `(req, res)` shim, fall through to `index.html`.

---

## Things worth understanding before you change them

### Upcoming versus past is always derived
Computed from `startDate` against the current time, at request time, every
time. There is no stored flag and there must never be one — it would go stale
the moment someone forgot to update it.

### Sector order and colour come from the CMS, presentation does not
`displayOrder` drives the student → graduate → worker → entrepreneur
progression. The accent colours, step numbers and desktop stagger live in
`src/lib/sectorTheme.js`, indexed by *position* — so reordering sectors in the
Studio moves the colour ramp with them. An editor never meets a Tailwind class.

### Metadata is replaced, not appended
`index.html` carries site-level defaults marked `data-default`; `PageMeta`
deletes those on mount and renders per-page equivalents. React 19 only appends,
so without the marker every page ends up with two `<title>` elements.

### Event link previews come from a function
`/events/:slug` is served by `api/event-preview.js`, which injects that event's
title, summary and cover into the shell. This runs for **every** request rather
than sniffing crawler user agents: a single WhatsApp share fires three
different Meta crawlers and Meta changes them. Same bytes for everyone means
nothing to maintain and `curl` reproduces what a scraper sees.

It uses `fm=jpg`, not `auto=format` — scraper WebP support is inconsistent.

### The contact mailer is a seam
`server/contact/` is platform-neutral: plain values in, `{ status, body }` out.
`api/contact.js` is the only Vercel-specific file, and the Cloudflare Pages
equivalent is written out in a comment at the top of it. Swapping mail provider
is one env var.

Defences in order: origin check → honeypot → length caps → full re-validation →
IP rate limit. **Rate limiting fails open** — a form that silently stops
accepting messages because a rate-limit store is down is worse than one that
lets an extra message through.

### Fonts are self-hosted
In `public/fonts`, declared in `src/index.css`. Google Fonts cost a
render-blocking third-party stylesheet plus two extra DNS/TLS handshakes (1.8s
of blocking time). **Inter is a variable font** — one file covers 400/500/600,
so do not add per-weight files. Headings are `font-semibold` because 600 is the
only Playfair weight loaded.

### Routes are code-split and prefetched
`src/App.jsx` lazy-loads every page except Home and NotFound, and prefetches
every chunk on idle. The split alone took the entry bundle from 169 kB gzipped
to 66 kB; the prefetch is what stops it trading that for a blank flash on first
navigation.

### Accessibility rules that came from real failures
- **pink-500 (`#E0417F`) is never small text** — 3.83:1 on off-white, below the
  4.5:1 minimum. It is for fills, rules, gradients, focus rings and display
  type 24px and over.
- **Never layer a text colour onto a button class.** `secondaryButton` sets
  `text-purple-700`; appending `text-off-white` does not win, because both are
  single-class selectors and stylesheet order decides. That shipped invisible
  text at 1.22:1. Use `secondaryButtonOnDark`, or add a variant.
- **Loading skeletons must approximate the height of what they replace**, or the
  footer leaps when content lands. That was a 0.564 CLS on sector pages.

---

## Current Lighthouse scores

Mobile, against a local harness serving the production build. Real-world numbers
should be better with Vercel's CDN and HTTP/2.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 73 | 100 | 100 | 100 | 4.7s | 0 |
| `/sectors/students` | 66 | 100 | 100 | 100 | 6.1s | 0 |
| `/events` | 66 | 100 | 100 | 100 | 6.5s | 0 |
| `/events/:slug` | 67 | 100 | 100 | 100 | 6.4s | 0 |

---

## Outstanding — roughly in priority order

### Blocking a real handover

1. **The Studio is not deployed.** It only runs on a developer's machine, so the
   client currently has nothing to log into. Fix:
   ```bash
   cd studio && npx sanity deploy
   ```
   Pick a hostname (`dg-events` gives `dg-events.sanity.studio`), then write the
   address into `docs/HANDOVER.md` and invite the client's email to the project.

2. **The contact form is not connected.** With no `WEB3FORMS_ACCESS_KEY` set it
   validates, then honestly tells the visitor it could not send. Create a
   Web3Forms key against the existing inbox and set it in Vercel, along with the
   Upstash pair for rate limiting.

3. **`VITE_SITE_URL` must be set in Vercel** to the production domain, and that
   domain **added to Sanity CORS**, or the live site shows error states while
   working perfectly locally.

### Known limitations

4. **Only event links get their own share preview.** Sector, gallery and about
   links share as the generic site card. The same function could handle them —
   a few extra lines — but they are stable enough not to need it.

5. **Structured data is client-rendered.** Google executes JavaScript so it will
   be indexed, but it is not in the initial HTML. If Event rich results are slow
   to appear, `api/event-preview.js` already builds the head for those pages and
   could inject the JSON-LD server-side.

6. **`Event` markup omits `offers`.** Bookings happen by phone, so there is no
   price or ticket URL. Google may flag it as a recommended field; inventing one
   would be worse.

7. **`prefers-reduced-motion` is code-verified, not runtime-verified.** The CSS
   media block and every `useReducedMotion()` call are in place, but the query
   was never emulated in a browser. Worth a manual check with the OS setting on.

8. **Route prefetching downloads ~20 kB gzipped that a visitor may never use.**
   A deliberate trade for instant navigation, and why Lighthouse still reports
   "unused JavaScript". Drop `usePrefetchRoutes` in `src/App.jsx` to reverse it.

9. **The footer's contact details are hardcoded** in `Footer.jsx` rather than
   read from the `siteSettings` singleton like the contact page. They will drift.
   Worth wiring up.

10. **`studio/` has 12 npm advisories** — `js-yaml`, `undici`, `smol-toml`, all
    transitive through the Sanity CLI. npm's proposed fix is a *downgrade* to
    `sanity@5`, which would break the v6 config. They are build tooling only and
    never reach the website; `studio/` is not installed by the Vercel build.

11. **Vercel Hobby is licensed for personal, non-commercial projects.** This is
    an organisation's marketing site. Worth a look before it matters.

12. **`src/App.css` is an orphaned Vite template leftover** — imported by
    nothing, and `CLAUDE.md` says no CSS files beyond `index.css`. Safe to
    delete.

### Content, not code
13. Some cover photos have unhelpful alt text (`"Logo"`) and one event has a
    placeholder summary (`"awf"`) — which is what a WhatsApp share of that event
    currently shows. Editor-side fixes, covered in `HANDOVER.md`.

---

## Conventions

Mobile-first. Components in `src/components`, pages in `src/pages`, one
component per file with a named export matching the filename. Tailwind
utilities directly in JSX; no CSS files beyond `index.css`. Every image needs
meaningful alt text. Animations respect `prefers-reduced-motion`. Copy uses
Ghanaian/British English spelling. Event data always comes from Sanity — never
hardcode it into a component.
