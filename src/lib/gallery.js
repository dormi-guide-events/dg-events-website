import { client } from "./sanity.js";
import {
  GALLERY_EVENT_FILTERS_QUERY,
  GALLERY_IMAGES_QUERY,
} from "./queries.js";

/** Gallery photos, newest first. `event` is an optional event slug. */
export function fetchGalleryImages({ limit = 60, event = null } = {}) {
  return client.fetch(GALLERY_IMAGES_QUERY, { limit, event });
}

/** The events that actually have photos, for the gallery filter. */
export function fetchGalleryEventFilters() {
  return client.fetch(GALLERY_EVENT_FILTERS_QUERY);
}
