// The seam between the UI and wherever event data lives. Today that is a local
// placeholder file; tomorrow it is a GROQ query against Sanity. Everything
// here is async so no component can grow a dependency on the data being
// available synchronously.

import { events } from "../data/events.js";

// Only in dev, so the loading states stay exercised while we build. Production
// pays nothing for this, and it goes away entirely with the real client.
const SIMULATED_LATENCY_MS = import.meta.env.DEV ? 350 : 0;

function startsAt(event) {
  return new Date(event.startDate).getTime();
}

function delay(ms) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// `sector` is an optional slug; omitting it means every sector.
function inSector(sector) {
  return (event) => !sector || event.sector === sector;
}

/**
 * Events that have not started yet, soonest first.
 *
 * Upcoming is always derived from startDate — never a stored flag, which would
 * go stale the moment someone forgets to update it.
 */
export async function fetchUpcomingEvents({
  limit = 3,
  sector,
  now = Date.now(),
} = {}) {
  await delay(SIMULATED_LATENCY_MS);

  return events
    .filter(inSector(sector))
    .filter((event) => startsAt(event) > now)
    .sort((a, b) => startsAt(a) - startsAt(b))
    .slice(0, limit);
}

/** Events that have already run, most recent first. */
export async function fetchPastEvents({
  limit = 12,
  sector,
  now = Date.now(),
} = {}) {
  await delay(SIMULATED_LATENCY_MS);

  return events
    .filter(inSector(sector))
    .filter((event) => startsAt(event) <= now)
    .sort((a, b) => startsAt(b) - startsAt(a))
    .slice(0, limit);
}
