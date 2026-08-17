// Shared rules for every slug field in the Studio.
//
// Why this exists: an event was published with the slug
// "career-path-conference-2026 " — one trailing space. The event card rendered
// href="/events/career-path-conference-2026 ", browsers strip trailing
// whitespace when resolving a URL, so the click could only ever land on the
// trimmed path. The detail page then asked Sanity for an exact match on the
// trimmed slug, found nothing, and showed the 404 page. The document was
// unreachable from any link on the site.
//
// A slug is a URL, so the field has to behave like one. Three guards:
//
//   slugify   — Generate can only ever produce a safe value
//   validate  — a value typed or pasted by hand is rejected with a plain
//               explanation rather than silently breaking a page
//   isUnique  — two documents cannot claim the same address, because the
//               frontend takes [0] and would pick one arbitrarily

/** Only lowercase letters, digits and single hyphens, never at either end. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// The combining accent marks NFKD separates out. Built from escapes rather
// than written literally: combining marks are invisible in source, so a
// literal character class here is unreadable and easy to corrupt.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

/** Longest slug we allow, matching the field's maxLength. */
export const SLUG_MAX_LENGTH = 96;

/**
 * Turn a title into a safe URL fragment.
 *
 * Trims first, so a title with stray whitespace cannot leak it into the slug,
 * and strips accents so "Café" becomes "cafe" rather than percent-encoded
 * bytes.
 */
export function slugify(input) {
  return String(input ?? "")
    .normalize("NFKD")
    // Drop the accent marks NFKD just separated out.
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    // "Founders & Funders" reads better as "founders-and-funders" than as
    // "founders-funders".
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    // Anything not a letter or digit becomes a separator.
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)
    // A trailing hyphen can reappear after the slice.
    .replace(/-+$/g, "");
}

/**
 * Reject anything that would not survive being put in a URL.
 *
 * Messages say what to do, not what went wrong — an editor should not have to
 * know what a slug is to get out of this.
 */
export function validateSlug(value) {
  const current = value?.current;

  if (!current) return "Press Generate to create the web address.";

  if (current !== current.trim()) {
    return "The web address cannot begin or end with a space. Press Generate to fix it.";
  }

  if (current.length > SLUG_MAX_LENGTH) {
    return `Please keep the web address under ${SLUG_MAX_LENGTH} characters.`;
  }

  if (!SLUG_PATTERN.test(current)) {
    return "Use lowercase letters, numbers and hyphens only — no spaces, capitals or punctuation. Press Generate to fix it.";
  }

  return true;
}

/**
 * Builds an `isUnique` check for a document type. Ignores the document's own
 * draft and published versions, so editing an existing one is not a clash with
 * itself.
 */
export function uniqueSlugFor(documentType) {
  return async function isUnique(slug, context) {
    const { document, getClient } = context;
    const client = getClient({ apiVersion: "2024-01-01" });

    const id = String(document?._id || "").replace(/^drafts\./, "");

    return client.fetch(
      `!defined(*[
        _type == $documentType
        && !(_id in [$draft, $published])
        && slug.current == $slug
      ][0]._id)`,
      {
        documentType,
        draft: `drafts.${id}`,
        published: id,
        slug,
      },
    );
  };
}

/** The whole slug field, ready to spread into a schema's options. */
export function slugOptions(documentType, source = "title") {
  return {
    source,
    maxLength: SLUG_MAX_LENGTH,
    slugify,
    isUnique: uniqueSlugFor(documentType),
  };
}
