import { SectionHeading } from "./SectionHeading.jsx";
import { EventCard } from "./EventCard.jsx";
import { Reveal } from "./Reveal.jsx";
import { useAsyncData } from "../hooks/useAsyncData.js";
import { fetchRelatedEvents } from "../lib/events.js";

/**
 * Other events in the same sector. Its own component so the detail page can
 * return early for loading and 404 without tripping over the rules of hooks.
 *
 * Renders nothing at all when there is nothing to relate to — an empty
 * "related" rail is worse than no rail.
 */
export function RelatedEvents({ slug, sector, sectorTitle }) {
  const { status, data } = useAsyncData(
    () => fetchRelatedEvents({ slug, sector, limit: 3 }),
    [slug, sector],
  );

  const events = data ?? [];
  if (status !== "ready" || events.length === 0) return null;

  return (
    <section
      aria-labelledby="related-events-heading"
      className="border-t border-purple-900/10 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          id="related-events-heading"
          eyebrow="More like this"
          title={
            sectorTitle ? `Also in ${sectorTitle}.` : "Also in this sector."
          }
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <li key={event._id}>
              <Reveal delay={index * 0.06} className="h-full">
                <EventCard event={event} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
