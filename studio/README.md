# DG Events Studio

The content editor for the DG Events website. Standalone Sanity Studio,
JavaScript, matching the frontend in the repository root.

The frontend is **not** connected to this yet — the Studio is deliberately
standalone until the schemas are signed off.

## The project

| | |
| --- | --- |
| Organisation | Dormi Guide Events (`o0B2bOnAx`) |
| Project | DG Events (`i2k116ix`) |
| Dataset | `production`, public |

Project ids are public identifiers rather than secrets, so `i2k116ix` is
committed in `env.js`. Set `SANITY_STUDIO_PROJECT_ID` to point the Studio at a
different project without editing the file.

Setup is complete: the schema is deployed and the four sectors are seeded.

## Running it

```bash
cd studio && npm run dev
```

Opens at http://localhost:3333.

## What is in here

| Path | Purpose |
| --- | --- |
| `sanity.config.js` | Studio config, plugins, singleton handling |
| `structure.js` | Sidebar order: Events, Gallery, Team, Sectors, Site settings |
| `env.js` | Project id and dataset name |
| `schemaTypes/` | The five document types |
| `seed/sectors.ndjson` | The four sectors from CLAUDE.md, ready to import |

## Seeding

```bash
npm run seed
```

Imports `seed/sectors.ndjson` into `production` with `--replace`. The documents
use fixed ids (`sector-students`, `sector-graduates`, `sector-workers`,
`sector-entrepreneurs`), so re-running it updates the same four documents
rather than creating duplicates, and events can reference them by a
predictable id.

After changing any schema file, redeploy so the hosted schema matches:

```bash
cd studio && npx sanity schema deploy
```

## Notes

- **Site settings is a singleton.** It has a fixed document id and is opened
  straight from the sidebar; it cannot be created, duplicated or deleted.
- **Upcoming versus past is never a field.** The website works it out by
  comparing `startDate` to the current date, so nothing has to be switched
  over after an event runs.
- **Icons must be imported from their own subpath**, for example
  `@sanity/icons/Calendar`. `@sanity/icons` v5 removed named icon exports from
  the package root, and a root import silently resolves to `undefined` instead
  of failing loudly.
