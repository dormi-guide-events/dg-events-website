// Schema.org builders. Kept out of the components so the shape of what Google
// receives can be read — and corrected — in one place.

import { absoluteUrl, SITE_URL } from "./siteUrl.js";
import { urlFor } from "./sanity.js";

const ORGANISATION_NAME = "Dormi Guide Events";

/** Drops keys whose value is null, undefined or an empty array. */
function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0),
    ),
  );
}

/**
 * The organisation itself. Contact details and social profiles come from the
 * siteSettings singleton, and are simply left out until that document exists —
 * incomplete markup is fine, wrong markup is not.
 */
export function organizationSchema(settings) {
  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANISATION_NAME,
    alternateName: "DG Events",
    url: SITE_URL || undefined,
    logo: SITE_URL ? absoluteUrl("/icon-512.png") : undefined,
    image: SITE_URL ? absoluteUrl("/og-default.png") : undefined,
    description:
      "A Ghanaian event-led organisation running events for students, graduates, workers and entrepreneurs.",
    foundingDate: "2026",
    address: compact({
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "GH",
    }),
    email: settings?.contactEmail || undefined,
    telephone: settings?.phone || undefined,
    sameAs: (settings?.socialLinks || [])
      .map((link) => link?.url)
      .filter(Boolean),
  });
}

/**
 * One event.
 *
 * Google requires name, startDate and location for an Event rich result;
 * everything else is recommended. `offers` is deliberately absent: DG Events
 * take bookings by phone, so there is no ticket URL or price to state, and
 * inventing one would be worse than omitting it.
 */
export function eventSchema(event) {
  if (!event?.title || !event?.startDate) return null;

  // location is required, so fall back through venue, then city, rather than
  // emitting a Place with no name at all.
  const placeName = event.venue || event.city || "Accra";

  const image = event.coverImage?.asset
    ? urlFor(event.coverImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .url()
    : SITE_URL
      ? absoluteUrl("/og-default.png")
      : undefined;

  return compact({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: compact({
      "@type": "Place",
      name: placeName,
      address: compact({
        "@type": "PostalAddress",
        // Only when the venue adds something the locality does not. An event
        // in Accra with "Accra" as its venue would otherwise emit the city
        // twice, once as a street address it plainly is not.
        streetAddress:
          event.venue && event.venue !== event.city ? event.venue : undefined,
        addressLocality: event.city || "Accra",
        addressCountry: "GH",
      }),
    }),
    image: image ? [image] : undefined,
    description: event.summary || undefined,
    url: SITE_URL ? absoluteUrl(`/events/${event.slug}`) : undefined,
    organizer: compact({
      "@type": "Organization",
      name: ORGANISATION_NAME,
      url: SITE_URL || undefined,
    }),
    about: event.sector?.title || undefined,
  });
}
