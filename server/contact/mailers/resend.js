// Resend.
//
// Switching to this is CONTACT_MAILER=resend plus the three variables below —
// no other code changes. It needs a DNS-verified sending domain: mail cannot
// be sent *from* a gmail.com address, though it is delivered *to* whichever
// inbox CONTACT_TO_EMAIL names, so DG Events still need no new mailbox.

export const name = "resend";

export function isConfigured(env) {
  return Boolean(
    env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && env.CONTACT_TO_EMAIL,
  );
}

export async function send(message, env) {
  if (!isConfigured(env)) {
    throw new Error(
      "Resend needs RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL",
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Never the visitor's address: sending as them would fail SPF and get
      // the domain's reputation burned.
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Resend rejected the message (${response.status}): ${body.slice(0, 200)}`,
    );
  }
}
