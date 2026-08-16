// Web3Forms relay.
//
// Called server-side, never from the browser, so the access key stays secret.
// That is the whole point: a Web3Forms key embedded in a page is public, and
// anyone who reads it can post straight to their endpoint and skip our
// validation, length caps and rate limiting entirely.
//
// The destination address is fixed to whatever the key was registered with,
// so there is no recipient to configure here. That also means a submission
// cannot be redirected by tampering with the request.

export const name = "web3forms";

export function isConfigured(env) {
  return Boolean(env.WEB3FORMS_ACCESS_KEY);
}

export async function send(message, env) {
  if (!isConfigured(env)) {
    throw new Error("WEB3FORMS_ACCESS_KEY is not set");
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_ACCESS_KEY,
      subject: message.subject,
      from_name: "DG Events website",
      // So a reply in their mail client goes to the visitor, not to us.
      replyto: message.replyTo,
      name: message.name,
      email: message.replyTo,
      message: message.text,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok || body?.success === false) {
    throw new Error(
      `Web3Forms rejected the message (${response.status}): ${
        body?.message || "no reason given"
      }`,
    );
  }
}
