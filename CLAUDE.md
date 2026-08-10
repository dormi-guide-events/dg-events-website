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

## Event content model (Sanity)

```
event
  title           string, required
  slug            slug, from title, required
  sector          reference → sector, required
  startDate       datetime, required
  endDate         datetime, optional
  venue           string
  city            string, default "Accra"
  coverImage      image with hotspot + alt text
  summary         text, ~160 chars, used on cards and meta description
  description     portable text (rich body)
  contactNote     string — how to attend, e.g. "Call 024 XXX XXXX to reserve a seat"
  isFeatured      boolean — pins to homepage
```

Upcoming vs past is derived from `startDate` compared to now. It is never a
manually-set field — that would rot the moment the client forgets to update it.

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
