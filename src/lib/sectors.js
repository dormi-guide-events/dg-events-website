// Sector reads.
//
// The four sectors are needed by the header of almost every page, the footer
// on all of them, and several sections in between. They also change about
// never. So the request is made once per page load and shared: the in-flight
// promise itself is cached, which means simultaneous callers on first paint
// coalesce into a single network request rather than four.

import { client } from "./sanity.js";
import { SECTORS_QUERY } from "./queries.js";

let inFlight = null;

/** All sectors in progression order. Cached for the life of the page. */
export function fetchSectors() {
  if (!inFlight) {
    inFlight = client.fetch(SECTORS_QUERY).catch((error) => {
      // Do not cache a failure, or a transient blip would persist until reload.
      inFlight = null;
      throw error;
    });
  }
  return inFlight;
}
