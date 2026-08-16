// IP rate limiting over Upstash Redis' REST API.
//
// REST rather than a Redis client on purpose: it is plain HTTPS, so the same
// code runs unchanged on Vercel, on Cloudflare Pages, or anywhere else with
// fetch. Nothing here is tied to a platform.
//
// This matters more than it looks. The transactional email tiers cap sending
// per day, so an unthrottled flood would burn the quota and then the form
// would quietly stop working for real people.

const WINDOWS = [
  { name: "hour", limit: 3, seconds: 60 * 60 },
  { name: "day", limit: 10, seconds: 60 * 60 * 24 },
];

/**
 * Runs one pipelined round trip per window: SET ... NX starts the window if it
 * is not already running, then INCR returns the count so far.
 */
async function bump(baseUrl, token, key, seconds) {
  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["SET", key, "0", "EX", String(seconds), "NX"],
      ["INCR", key],
    ]),
  });

  if (!response.ok) {
    throw new Error(`Upstash responded ${response.status}`);
  }

  const results = await response.json();
  const count = Number(results?.[1]?.result);
  if (!Number.isFinite(count)) {
    throw new Error("Upstash returned an unexpected pipeline result");
  }
  return count;
}

/**
 * Returns { allowed, reason }.
 *
 * Fails open. If Upstash is unset or unreachable the submission is allowed
 * through: a contact form that silently stops accepting messages because a
 * rate-limit store is down is a worse failure than one that briefly lets an
 * extra message past. The honeypot, the length caps and the origin check all
 * still apply.
 */
export async function checkRateLimit(ip, env) {
  const baseUrl = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (!baseUrl || !token) {
    return { allowed: true, reason: "not-configured" };
  }
  if (!ip) {
    return { allowed: true, reason: "no-client-ip" };
  }

  try {
    for (const window of WINDOWS) {
      const count = await bump(
        baseUrl,
        token,
        `contact:${window.name}:${ip}`,
        window.seconds,
      );
      if (count > window.limit) {
        return { allowed: false, reason: window.name };
      }
    }
    return { allowed: true, reason: "within-limits" };
  } catch (error) {
    console.error("Rate limit check failed, allowing through:", error.message);
    return { allowed: true, reason: "check-failed" };
  }
}
