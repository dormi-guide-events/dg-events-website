import { Link } from "react-router-dom";
import { getSector } from "../lib/sectors.js";
import { eventDateParts, formatEventWhen } from "../lib/dates.js";

/**
 * The title link is stretched over the whole card with an ::after overlay, so
 * the card is one large target while remaining a single interactive element.
 *
 * Until Sanity supplies real photography, coverImage.url is null and the cover
 * falls back to a gradient panel drawn from the sector's own slice of the
 * brand gradient. The alt text is already written for when the image lands.
 */
export function EventCard({ event }) {
  const sector = getSector(event.sector);
  const { day, month } = eventDateParts(event.startDate);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-purple-900/10 transition-shadow duration-300 hover:shadow-lg hover:shadow-purple-900/5">
      <div className="relative aspect-video overflow-hidden">
        {event.coverImage?.url ? (
          <img
            src={event.coverImage.url}
            alt={event.coverImage.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className={`flex h-full w-full items-center justify-center bg-linear-to-br ${sector.coverFrom} ${sector.coverTo}`}
          >
            <svg viewBox="0 0 120 120" className="h-24 w-24 opacity-30">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#FBF9FB"
                strokeWidth="1.5"
              />
              <circle
                cx="60"
                cy="60"
                r="38"
                fill="none"
                stroke="#FBF9FB"
                strokeWidth="1"
                strokeDasharray="3 10"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        <p className="absolute bottom-3 left-3 rounded-xl bg-off-white px-3 py-1.5 text-center">
          <span className="block font-serif text-xl leading-tight text-purple-900">
            {day}
          </span>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-purple-700">
            {month}
          </span>
        </p>

        {event.isFeatured && (
          <p className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-off-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-purple-900">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-gold-500"
            />
            Featured
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${sector.accentBg}`}
          />
          {sector.remit}
        </p>

        <h3 className="mt-3 font-serif text-lg text-purple-900 md:text-xl">
          <Link
            to={`/events/${event.slug}`}
            className="rounded-sm after:absolute after:inset-0 hover:text-purple-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
          >
            {event.title}
          </Link>
        </h3>

        <p className="mt-2.5 text-sm leading-relaxed text-grey-500">
          {event.summary}
        </p>

        <dl className="mt-4 space-y-1 text-xs text-grey-500">
          <div>
            <dt className="sr-only">Date</dt>
            <dd>
              <time dateTime={event.startDate}>
                {formatEventWhen(event.startDate, event.endDate)}
              </time>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Venue</dt>
            <dd>
              {event.venue} · {event.city}
            </dd>
          </div>
        </dl>

        <p className="mt-4 border-t border-purple-900/10 pt-3 text-xs leading-relaxed text-purple-700">
          {event.contactNote}
        </p>
      </div>
    </article>
  );
}
