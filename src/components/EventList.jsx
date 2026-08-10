import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal.jsx";
import { EventCard } from "./EventCard.jsx";
import { fetchUpcomingEvents } from "../lib/events.js";
import { secondaryButton } from "../lib/ui.js";

/**
 * Async list of upcoming events with all four states: loading, ready, empty
 * and failed. Extracted from the home page so sector pages get the identical
 * behaviour rather than a second implementation.
 *
 * `sector` is an optional slug. Props are primitives on purpose — passing a
 * fetcher function would make the effect re-run on every parent render.
 */
export function EventList({ sector, limit = 3, emptyHeading, emptyBody }) {
  const [status, setStatus] = useState("loading");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchUpcomingEvents({ sector, limit })
      .then((upcoming) => {
        if (cancelled) return;
        setEvents(upcoming);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [sector, limit]);

  const notice =
    status === "error"
      ? {
          heading: "We could not load the calendar",
          body: "Something went wrong at our end. Give it a moment and refresh, or call us and we will tell you what is coming up.",
        }
      : { heading: emptyHeading, body: emptyBody };

  return (
    <div className="mt-12" aria-busy={status === "loading"}>
      {status === "loading" && (
        <>
          <p role="status" className="sr-only">
            Loading upcoming events…
          </p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: Math.min(limit, 3) }, (_, index) => (
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
            <li key={event.slug}>
              <Reveal delay={index * 0.06} className="h-full">
                <EventCard event={event} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      {(status === "error" || (status === "ready" && events.length === 0)) && (
        <div className="rounded-2xl border border-dashed border-purple-900/20 bg-pink-100/50 px-6 py-14 text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-700 to-pink-500"
          >
            <span className="h-5 w-5 rounded-full bg-off-white" />
          </span>
          <h3 className="mt-5 font-serif text-xl text-purple-900">
            {notice.heading}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-grey-500">
            {notice.body}
          </p>
          <Link
            to="/contact"
            className={`${secondaryButton} mt-7 border-purple-900/20 bg-off-white`}
          >
            Get in touch
          </Link>
        </div>
      )}
    </div>
  );
}
