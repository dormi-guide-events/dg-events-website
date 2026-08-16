import * as web3forms from "./web3forms.js";
import * as resend from "./resend.js";

const MAILERS = { web3forms, resend };

/**
 * The seam. Every provider exposes the same three things, so moving between
 * them is one environment variable and no code change.
 *
 * Defaults to Web3Forms because it needs no DNS-verified sending domain — set
 * CONTACT_MAILER=resend once DG Events have one.
 */
export function getMailer(env) {
  const requested = String(env.CONTACT_MAILER || "web3forms").toLowerCase();
  const mailer = MAILERS[requested];

  if (!mailer) {
    throw new Error(
      `Unknown CONTACT_MAILER "${requested}". Expected one of: ${Object.keys(MAILERS).join(", ")}`,
    );
  }

  return mailer;
}
