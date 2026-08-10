// Accessors over the sector content. Mirrors the data/lib split used for
// events: src/data holds the content, src/lib holds the ways of reading it.

import { sectors } from "../data/sectors.js";

export { sectors };

export function getSector(slug) {
  return sectors.find((sector) => sector.slug === slug);
}

/** The other three sectors, in progression order — used for cross-navigation. */
export function getOtherSectors(slug) {
  return sectors.filter((sector) => sector.slug !== slug);
}
