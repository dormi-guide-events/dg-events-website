// Every GROQ query the site runs. Keeping them together means the shape of
// what the frontend expects can be read in one sitting, and changing a
// projection never means hunting through components.

// Shared projection for anything that renders an EventCard.
//
// `sector->` resolves the reference inline so a card never has to make a
// second lookup. coverImage keeps its raw asset reference — that is what
// @sanity/image-url needs — and pulls the LQIP blur and dimensions alongside
// it so images can reserve their space and fade in from a placeholder.
const EVENT_CARD_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  startDate,
  endDate,
  venue,
  city,
  summary,
  contactNote,
  isFeatured,
  sector->{
    title,
    "slug": slug.current,
    remit,
    displayOrder
  },
  coverImage{
    alt,
    asset,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions
  }
`;

// Order is meaningful: the site presents the sectors as a progression, so
// displayOrder drives both the sequence and the purple→pink accent ramp.
export const SECTORS_QUERY = /* groq */ `
  *[_type == "sector" && defined(slug.current)] | order(displayOrder asc) {
    _id,
    title,
    "slug": slug.current,
    remit,
    headline,
    purpose,
    shortDescription,
    displayOrder,
    eventFormats[]{ _key, name, description }
  }
`;

// Upcoming and past are derived by comparing startDate to $now on every
// request. There is no stored flag, so nothing can go stale.
//
// $sector is a slug or null; null means every sector.
export const UPCOMING_EVENTS_QUERY = /* groq */ `
  *[
    _type == "event"
    && defined(slug.current)
    && startDate > $now
    && ($sector == null || sector->slug.current == $sector)
  ] | order(startDate asc) [0...$limit] {
    ${EVENT_CARD_FIELDS}
  }
`;

export const PAST_EVENTS_QUERY = /* groq */ `
  *[
    _type == "event"
    && defined(slug.current)
    && startDate <= $now
    && ($sector == null || sector->slug.current == $sector)
  ] | order(startDate desc) [0...$limit] {
    ${EVENT_CARD_FIELDS}
  }
`;

// The detail page adds the rich body and the summary; everything else it
// shares with the card.
export const EVENT_BY_SLUG_QUERY = /* groq */ `
  *[_type == "event" && slug.current == $slug][0]{
    ${EVENT_CARD_FIELDS},
    description
  }
`;

// Other events in the same sector. Upcoming ones come first — select() turns
// the comparison into a sortable 0/1, because GROQ will not order on a bare
// boolean expression.
export const RELATED_EVENTS_QUERY = /* groq */ `
  *[
    _type == "event"
    && defined(slug.current)
    && slug.current != $slug
    && sector->slug.current == $sector
  ] | order(select(startDate > $now => 0, 1) asc, startDate asc) [0...$limit] {
    ${EVENT_CARD_FIELDS}
  }
`;

export const GALLERY_IMAGES_QUERY = /* groq */ `
  *[
    _type == "galleryImage"
    && defined(image.asset)
    && ($event == null || event->slug.current == $event)
  ] | order(date desc, _createdAt desc) [0...$limit] {
    _id,
    caption,
    date,
    event->{ title, "slug": slug.current },
    image{
      alt,
      asset,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  }
`;

// Only events that actually have photos, so the gallery filter never offers a
// choice that leads nowhere.
export const GALLERY_EVENT_FILTERS_QUERY = /* groq */ `
  *[
    _type == "event"
    && defined(slug.current)
    && count(*[_type == "galleryImage" && references(^._id)]) > 0
  ] | order(startDate desc) {
    _id,
    title,
    "slug": slug.current
  }
`;

export const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0]{
    contactEmail,
    phone,
    address,
    socialLinks[]{ _key, platform, url }
  }
`;
