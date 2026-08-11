import { client } from "./sanity.js";
import { SITE_SETTINGS_QUERY } from "./queries.js";

/**
 * The site settings singleton. Resolves to null until someone fills it in in
 * the Studio, so every caller has to cope with its absence.
 */
export function fetchSiteSettings() {
  return client.fetch(SITE_SETTINGS_QUERY);
}
