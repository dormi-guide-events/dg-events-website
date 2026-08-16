// Vercel adapter for the contact form. Deliberately thin: it reads the
// request, calls the platform-neutral core, and writes the response.
//
// The Cloudflare Pages equivalent is the same shape:
//
//   export async function onRequestPost({ request, env }) {
//     const result = await handleContactSubmission({
//       payload: await request.json(),
//       ip: request.headers.get("cf-connecting-ip"),
//       origin: request.headers.get("origin"),
//       allowedOrigins: [...],
//       env,
//     });
//     return Response.json(result.body, { status: result.status });
//   }

import {
  handleContactSubmission,
  MAX_BODY_BYTES,
} from "../server/contact/index.js";

function allowedOrigins(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";

  return [
    host ? `${protocol}://${host}` : null,
    process.env.VITE_SITE_URL || null,
  ].filter(Boolean);
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    // Left-most entry is the original client; the rest are proxies.
    return forwarded.split(",")[0].trim();
  }
  return req.headers["x-real-ip"] || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  // Reject oversized bodies before parsing anything.
  const declaredLength = Number(req.headers["content-length"] || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    res.status(413).json({ ok: false, error: "payload_too_large" });
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") {
    if (Buffer.byteLength(payload) > MAX_BODY_BYTES) {
      res.status(413).json({ ok: false, error: "payload_too_large" });
      return;
    }
    try {
      payload = JSON.parse(payload);
    } catch {
      res.status(400).json({ ok: false, error: "invalid_body" });
      return;
    }
  }

  const result = await handleContactSubmission({
    payload,
    ip: clientIp(req),
    origin: req.headers.origin || null,
    allowedOrigins: allowedOrigins(req),
    env: process.env,
  });

  // Never cached: every submission is its own request.
  res.setHeader("Cache-Control", "no-store");
  res.status(result.status).json(result.body);
}
