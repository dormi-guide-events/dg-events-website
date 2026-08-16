// The contact form's actual logic, with no knowledge of any hosting platform.
//
// Takes plain values and returns { status, body }. Everything platform
// specific — reading the request, writing the response, finding the client IP
// — lives in a thin adapter: api/contact.js on Vercel, and a near-identical
// functions/api/contact.js if this moves to Cloudflare Pages.

import { getMailer } from "./mailers/index.js";
import { checkRateLimit } from "./rateLimit.js";
import { MAX_BODY_BYTES, validateSubmission } from "./validate.js";

export { MAX_BODY_BYTES };

function buildMessage(values, submittedAt) {
  const text = [
    "New message from the DG Events website.",
    "",
    `Name:    ${values.name}`,
    `Email:   ${values.email}`,
    `Subject: ${values.subject}`,
    "",
    "Message:",
    values.message,
    "",
    `Sent ${submittedAt}`,
  ].join("\n");

  return {
    // Prefixed so it is obvious in an inbox where this came from, and so the
    // visitor cannot make it look like internal mail.
    subject: `DG Events website: ${values.subject}`,
    replyTo: values.email,
    name: values.name,
    text,
  };
}

/**
 * @param {object} args
 * @param {unknown} args.payload      already-parsed request body
 * @param {string|null} args.ip       client IP, for rate limiting only
 * @param {string|null} args.origin   request Origin header, if any
 * @param {string[]} args.allowedOrigins
 * @param {object} args.env           environment variables
 */
export async function handleContactSubmission({
  payload,
  ip = null,
  origin = null,
  allowedOrigins = [],
  env = {},
}) {
  // Cross-origin posts are not something this form ever does. Absent Origin is
  // allowed because non-browser clients omit it; a present but wrong one is
  // a deliberate attempt and gets nothing.
  if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    return { status: 403, body: { ok: false, error: "forbidden_origin" } };
  }

  if (!payload || typeof payload !== "object") {
    return { status: 400, body: { ok: false, error: "invalid_body" } };
  }

  // The honeypot is invisible to people and irresistible to bots. Report
  // success so the bot learns nothing, and send nothing.
  if (String(payload.company ?? "").trim()) {
    return { status: 200, body: { ok: true } };
  }

  const { errors, values } = validateSubmission(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, body: { ok: false, error: "validation", fields: errors } };
  }

  const rate = await checkRateLimit(ip, env);
  if (!rate.allowed) {
    return { status: 429, body: { ok: false, error: "rate_limited" } };
  }

  let mailer;
  try {
    mailer = getMailer(env);
  } catch (error) {
    console.error("Contact mailer is misconfigured:", error.message);
    return { status: 500, body: { ok: false, error: "not_configured" } };
  }

  if (!mailer.isConfigured(env)) {
    console.error(`Contact mailer "${mailer.name}" is missing its credentials`);
    return { status: 500, body: { ok: false, error: "not_configured" } };
  }

  try {
    await mailer.send(buildMessage(values, new Date().toISOString()), env);
  } catch (error) {
    // Log the detail, tell the visitor nothing beyond "it failed" — error
    // text from a provider can leak configuration.
    console.error(`Contact send failed via ${mailer.name}:`, error.message);
    return { status: 502, body: { ok: false, error: "send_failed" } };
  }

  return { status: 200, body: { ok: true } };
}
