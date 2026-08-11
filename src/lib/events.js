// Event reads. The signatures are unchanged from the placeholder era on
// purpose — only the source behind them moved to Sanity.
//
// `now` is computed per call rather than passed in from a component, so a
// re-render can never produce a new value and retrigger a fetch loop.

import { client } from "./sanity.js";
import {
  EVENT_BY_SLUG_QUERY,
  PAST_EVENTS_QUERY,
  RELATED_EVENTS_QUERY,
  UPCOMING_EVENTS_QUERY,
} from "./queries.js";

/**
 * Events that have not started yet, soonest first.
 *
 * Upcoming is derived from startDate every time it is asked for — never a
 * stored flag, which would go stale the moment someone forgets to update it.
 */
export function fetchUpcomingEvents({ limit = 3, sector = null } = {}) {
  return client.fetch(UPCOMING_EVENTS_QUERY, {
    limit,
    sector,
    now: new Date().toISOString(),
  });
}

/** Events that have already run, most recent first. */
export function fetchPastEvents({ limit = 12, sector = null } = {}) {
  return client.fetch(PAST_EVENTS_QUERY, {
    limit,
    sector,
    now: new Date().toISOString(),
  });
}

/** One event by slug, with its rich description. Resolves to null if absent. */
export function fetchEventBySlug(slug) {
  return client.fetch(EVENT_BY_SLUG_QUERY, { slug });
}

/** Other events in the same sector, upcoming ones first. */
export function fetchRelatedEvents({ slug, sector, limit = 3 }) {
  return client.fetch(RELATED_EVENTS_QUERY, {
    slug,
    sector,
    limit,
    now: new Date().toISOString(),
  });
}
