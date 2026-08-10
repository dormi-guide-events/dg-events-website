// Ghanaian English reads dates the British way — 19 September 2026, not
// September 19. Everything is pinned to Accra so a visitor's device timezone
// can never shift an event onto the wrong day.

const TIME_ZONE = "Africa/Accra";
const LOCALE = "en-GB";

const dayNumber = new Intl.DateTimeFormat(LOCALE, { day: "numeric", timeZone: TIME_ZONE });
const shortMonth = new Intl.DateTimeFormat(LOCALE, { month: "short", timeZone: TIME_ZONE });
const longDate = new Intl.DateTimeFormat(LOCALE, {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: TIME_ZONE,
});
const timeOfDay = new Intl.DateTimeFormat(LOCALE, {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: TIME_ZONE,
});
const sortableDay = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: TIME_ZONE,
});

/** Day and month for the date tile on an event card. */
export function eventDateParts(startDate) {
  const date = new Date(startDate);
  return { day: dayNumber.format(date), month: shortMonth.format(date) };
}

/**
 * A readable "when" line: a single day collapses to one date with a time
 * range, a multi-day event reads as a span.
 */
export function formatEventWhen(startDate, endDate) {
  const start = new Date(startDate);
  const startsOn = longDate.format(start);

  if (!endDate) return `${startsOn} · from ${timeOfDay.format(start)}`;

  const end = new Date(endDate);
  if (sortableDay.format(start) === sortableDay.format(end)) {
    return `${startsOn} · ${timeOfDay.format(start)} – ${timeOfDay.format(end)}`;
  }

  return `${startsOn} – ${longDate.format(end)}`;
}
