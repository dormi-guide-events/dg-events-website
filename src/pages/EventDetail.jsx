import { Link, useParams } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";
import { JsonLd } from "../components/JsonLd.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { SanityImage } from "../components/SanityImage.jsx";
import { PortableText } from "../components/PortableText.jsx";
import { RelatedEvents } from "../components/RelatedEvents.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { useAsyncData } from "../hooks/useAsyncData.js";
import { fetchEventBySlug } from "../lib/events.js";
import { themeForDisplayOrder } from "../lib/sectorTheme.js";
import { eventSchema } from "../lib/structuredData.js";
import { formatEventWhen } from "../lib/dates.js";
import { urlFor } from "../lib/sanity.js";
import { secondaryButton } from "../lib/ui.js";
import { NotFound } from "./NotFound.jsx";

export function EventDetail() {
  const { slug } = useParams();
  const { status, data: event } = useAsyncData(
    () => fetchEventBySlug(slug),
    [slug],
  );

  if (status === "loading") {
    return (
      <div
        className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 lg:px-8"
        aria-busy="true"
      >
        <p role="status" className="sr-only">
          Loading event…
        </p>
        <div aria-hidden="true" className="space-y-4">
          <div className="h-0.5 w-16 animate-pulse bg-purple-900/10" />
          <div className="h-3 w-44 animate-pulse rounded-full bg-purple-900/10" />
          <div className="h-12 w-3/4 animate-pulse rounded-lg bg-purple-900/10" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-purple-900/10" />
          <div className="mt-8 aspect-video w-full animate-pulse rounded-2xl bg-purple-900/10" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 lg:px-8">
        <PageMeta
          title="Event"
          description="Details, dates and venue for a Dormi Guide Events programme in Ghana."
        />
        <EmptyState
          heading="We could not load this event"
          body="Something went wrong at our end. Refresh in a moment, or call us and we will tell you everything about it."
        />
      </div>
    );
  }

  // Only a genuine 404 once loading has finished.
  if (!event) return <NotFound />;

  const theme = themeForDisplayOrder(event.sector?.displayOrder);
  const when = formatEventWhen(event.startDate, event.endDate);
  const where = [event.venue, event.city].filter(Boolean).join(", ");

  // Social previews want a fixed 1200x630 crop rather than the original.
  const ogImage = event.coverImage?.asset
    ? urlFor(event.coverImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url()
    : undefined;

  return (
    <>
      <PageMeta
        type="article"
        title={event.title}
        description={
          event.summary ||
          `${event.title} — ${when}${where ? `, ${where}` : ""}.`
        }
        image={ogImage}
        imageAlt={event.coverImage?.alt}
      />

      {/* What puts this event into Google's event results. */}
      <JsonLd data={eventSchema(event)} />

      <article>
        <PageHeader
          accentRule={theme.accentRule}
          eyebrow={
            event.sector ? (
              <Link
                to={`/sectors/${event.sector.slug}`}
                className="rounded-sm transition-colors hover:text-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
              >
                {event.sector.title}
                {event.sector.remit ? ` · ${event.sector.remit}` : ""}
              </Link>
            ) : (
              "Event"
            )
          }
          title={event.title}
          lead={event.summary}
        >
          <dl className="mt-8 flex flex-col gap-3 text-sm text-charcoal sm:flex-row sm:flex-wrap sm:gap-x-8">
            <div className="flex gap-2">
              <dt className="font-semibold text-purple-700">When</dt>
              <dd>
                <time dateTime={event.startDate}>{when}</time>
              </dd>
            </div>
            {where && (
              <div className="flex gap-2">
                <dt className="font-semibold text-purple-700">Where</dt>
                <dd>{where}</dd>
              </div>
            )}
          </dl>

          {event.coverImage?.asset && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-purple-900/10">
              <SanityImage
                image={event.coverImage}
                loading="eager"
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="aspect-video w-full object-cover"
              />
            </div>
          )}
        </PageHeader>

        <div className="border-t border-purple-900/10 py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-12">
              {/* First in the DOM so "how to attend" is read early — visitors
                  contact DG Events directly, there is no booking here. */}
              <aside className="lg:col-start-3 lg:row-start-1">
                <div className="lg:sticky lg:top-24">
                  {event.contactNote && (
                    <div className="rounded-2xl bg-purple-900 p-6 text-off-white">
                      <h2 className="font-serif text-xl">How to attend</h2>
                      <p className="mt-3 text-sm leading-relaxed text-off-white/80">
                        {event.contactNote}
                      </p>
                      <Link
                        to="/contact"
                        className={`${secondaryButton} mt-6 w-full border-off-white/25 text-off-white hover:border-off-white hover:bg-off-white/10`}
                      >
                        Contact us
                      </Link>
                    </div>
                  )}

                  <dl className="mt-8 space-y-4 border-t border-purple-900/10 pt-6 text-sm">
                    <div>
                      <dt className="font-semibold text-purple-700">Date</dt>
                      <dd className="mt-1 text-charcoal">
                        <time dateTime={event.startDate}>{when}</time>
                      </dd>
                    </div>
                    {event.venue && (
                      <div>
                        <dt className="font-semibold text-purple-700">Venue</dt>
                        <dd className="mt-1 text-charcoal">{event.venue}</dd>
                      </div>
                    )}
                    {event.city && (
                      <div>
                        <dt className="font-semibold text-purple-700">City</dt>
                        <dd className="mt-1 text-charcoal">{event.city}</dd>
                      </div>
                    )}
                    {event.sector && (
                      <div>
                        <dt className="font-semibold text-purple-700">
                          Sector
                        </dt>
                        <dd className="mt-1">
                          <Link
                            to={`/sectors/${event.sector.slug}`}
                            className="rounded-sm text-purple-700 underline decoration-pink-500 underline-offset-4 transition-colors hover:text-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                          >
                            {event.sector.title}
                          </Link>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </aside>

              <div className="mt-12 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mt-0">
                <h2 className="sr-only">About this event</h2>
                {Array.isArray(event.description) &&
                event.description.length > 0 ? (
                  <PortableText value={event.description} />
                ) : (
                  <p className="text-base leading-relaxed text-grey-500">
                    Full details for this event are still being written up. Get
                    in touch and we will tell you everything you need to know.
                  </p>
                )}

                <p className="mt-12">
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-purple-700 transition-colors hover:text-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" />
                    </svg>
                    All events
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {event.sector && (
        <RelatedEvents
          slug={event.slug}
          sector={event.sector.slug}
          sectorTitle={event.sector.title}
        />
      )}

      <ClosingCta />
    </>
  );
}
