import { EventCard } from "./EventCard.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { Reveal } from "./Reveal.jsx";
import { useAsyncData } from "../hooks/useAsyncData.js";
import { fetchPastEvents, fetchUpcomingEvents } from "../lib/events.js";

/**
 * Async list of events with all four states: loading, ready, empty and failed.
 *
 * `scope` is "upcoming" (soonest first) or "past" (most recent first), and
 * both are derived from startDate at request time rather than stored.
 * `sector` is an optional slug. Every prop is a primitive on purpose — passing
 * a fetcher would re-run the effect on each parent render.
 */
export function EventList({
  sector = null,
  limit = 3,
  scope = "upcoming",
  emptyHeading,
  emptyBody,
  emptyActionLabel,
  emptyActionTo,
}) {
  const { status, data } = useAsyncData(
    () =>
      scope === "past"
        ? fetchPastEvents({ sector, limit })
        : fetchUpcomingEvents({ sector, limit }),
    [sector, limit, scope],
  );

  const events = data ?? [];
  const skeletonCount = Math.min(limit, 3);

  return (
    <div className="mt-12" aria-busy={status === "loading"}>
      {status === "loading" && (
        <>
          <p role="status" className="sr-only">
            Loading events…
          </p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: skeletonCount }, (_, index) => (
              <li
                key={index}
                aria-hidden="true"
                className="overflow-hidden rounded-2xl border border-purple-900/10"
              >
                <div className="aspect-video animate-pulse bg-purple-900/10" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-28 animate-pulse rounded-full bg-purple-900/10" />
                  <div className="h-5 w-3/4 animate-pulse rounded-full bg-purple-900/10" />
                  <div className="h-3 w-full animate-pulse rounded-full bg-purple-900/10" />
                  <div className="h-3 w-5/6 animate-pulse rounded-full bg-purple-900/10" />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {status === "ready" && events.length > 0 && (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <li key={event._id}>
              <Reveal delay={index * 0.06} className="h-full">
                <EventCard event={event} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      {status === "error" && (
        <EmptyState
          heading="We could not load the calendar"
          body="Something went wrong at our end. Give it a moment and refresh, or call us and we will tell you what is coming up."
        />
      )}

      {status === "ready" && events.length === 0 && (
        <EmptyState
          heading={emptyHeading}
          body={emptyBody}
          actionLabel={emptyActionLabel}
          actionTo={emptyActionTo}
        />
      )}
    </div>
  );
}
