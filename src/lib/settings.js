import { client } from "./sanity.js";
import { SITE_SETTINGS_QUERY } from "./queries.js";

// Wanted by the contact page and by the homepage's Schema.org markup, and it
// changes about never — so the in-flight promise is shared, exactly as the
// sectors request is. Two callers on first paint make one network request.
let inFlight = null;

/**
 * The site settings singleton. Resolves to null until someone fills it in in
 * the Studio, so every caller has to cope with its absence.
 */
export function fetchSiteSettings() {
  if (!inFlight) {
    inFlight = client.fetch(SITE_SETTINGS_QUERY).catch((error) => {
      // Do not cache a failure, or a transient blip would persist until reload.
      inFlight = null;
      throw error;
    });
  }
  return inFlight;
}
