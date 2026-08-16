/**
 * A phone number reads with spaces and brackets but has to dial without them.
 * Returns null when there is nothing dialable, so callers can leave the link
 * out rather than render a broken one.
 */
export function telHref(phone) {
  const digits = String(phone ?? "").replace(/[^\d+]/g, "");
  return digits.length >= 6 ? `tel:${digits}` : null;
}
