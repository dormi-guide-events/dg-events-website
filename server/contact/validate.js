// Server-side validation. The browser runs the same rules for a good
// experience, but nothing here trusts that — this is the only copy that
// counts, per the security rules in CLAUDE.md.

/** Hard caps, enforced before any real work happens. */
export const LIMITS = {
  name: 100,
  email: 200,
  subject: 150,
  message: 2000,
};

/** Anything larger than this is rejected without being parsed. */
export const MAX_BODY_BYTES = 16 * 1024;

// Deliberately loose: the job is to catch typos, not to police what a valid
// address looks like. Anything stricter rejects real people.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// CR and LF are the dangerous ones — injected into a Subject or a Reply-To
// they let an attacker append headers of their own, a Bcc to a mailing list
// say. U+2028 and U+2029 come along because some clients and log pipelines
// treat them as line breaks too.
//
// Built with new RegExp rather than a literal: U+2028 and U+2029 are line
// terminators in JavaScript, so writing them raw inside a regex literal is a
// syntax error.
const LINE_BREAKS = new RegExp("[\\r\\n\\u2028\\u2029]+", "g");
const UNICODE_LINE_SEPARATORS = new RegExp("[\\u2028\\u2029]", "g");
const CONTROL_CHARS = /\p{Cc}/gu;

/** Make a value safe to put on a header line. */
export function sanitiseHeaderValue(value) {
  return String(value ?? "")
    .replace(LINE_BREAKS, " ")
    .replace(CONTROL_CHARS, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Make a value safe to put in the body of an email. Newlines survive here —
 * it is a message, not a header — but nothing else that could confuse a
 * client or a log.
 */
export function sanitiseBodyValue(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(UNICODE_LINE_SEPARATORS, "\n")
    .split("\n")
    .map((line) =>
      line
        .replace(CONTROL_CHARS, "")
        .replace(/[^\S\n]+/g, " ")
        .trimEnd(),
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tooLong(value, max) {
  return String(value ?? "").length > max;
}

/**
 * Returns { errors, values }. `values` is only meaningful when `errors` is
 * empty, and is already sanitised for the place each field is going.
 */
export function validateSubmission(input) {
  const errors = {};
  const raw = {
    name: String(input?.name ?? ""),
    email: String(input?.email ?? ""),
    subject: String(input?.subject ?? ""),
    message: String(input?.message ?? ""),
  };

  // Length first, on the raw value, so an oversized field is rejected outright
  // rather than quietly trimmed into something acceptable.
  for (const [field, max] of Object.entries(LIMITS)) {
    if (tooLong(raw[field], max)) {
      errors[field] = `Please keep this under ${max} characters.`;
    }
  }

  const name = sanitiseHeaderValue(raw.name);
  const email = sanitiseHeaderValue(raw.email);
  const subject = sanitiseHeaderValue(raw.subject);
  const message = sanitiseBodyValue(raw.message);

  if (!errors.name) {
    if (!name) errors.name = "Please tell us your name.";
    else if (name.length < 2)
      errors.name = "That looks a little short for a name.";
  }

  if (!errors.email) {
    if (!email) errors.email = "We need an email address to write back to.";
    else if (!EMAIL.test(email))
      errors.email = "That address does not look right — check for a typo.";
  }

  if (!errors.subject && !subject) {
    errors.subject =
      "Give your message a subject so it reaches the right person.";
  }

  if (!errors.message) {
    if (!message) errors.message = "Your message is empty.";
    else if (message.length < 10)
      errors.message = "Tell us a little more — a sentence or two is plenty.";
  }

  return { errors, values: { name, email, subject, message } };
}
