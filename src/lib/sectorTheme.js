// Presentation tokens for the sectors. These are deliberately NOT in the CMS:
// they are design, not content, and an editor should never have to think about
// a Tailwind class.
//
// The ramp is indexed by position in the progression rather than by slug, so
// the purple→pink gradient and the ascending desktop staircase always follow
// whatever order the CMS says — reorder the sectors and the colours follow.

const THEMES = [
  {
    accentText: "text-purple-900",
    accentBg: "bg-purple-900",
    accentBorder: "border-purple-900",
    accentHoverBg: "group-hover:bg-purple-900",
    accentRule: "from-purple-900",
    coverFrom: "from-purple-900",
    coverTo: "to-purple-700",
    lgOffset: "lg:mt-24",
  },
  {
    accentText: "text-purple-700",
    accentBg: "bg-purple-700",
    accentBorder: "border-purple-700",
    accentHoverBg: "group-hover:bg-purple-700",
    accentRule: "from-purple-700",
    coverFrom: "from-purple-700",
    coverTo: "to-purple-500",
    lgOffset: "lg:mt-16",
  },
  {
    accentText: "text-purple-500",
    accentBg: "bg-purple-500",
    accentBorder: "border-purple-500",
    accentHoverBg: "group-hover:bg-purple-500",
    accentRule: "from-purple-500",
    coverFrom: "from-purple-500",
    coverTo: "to-pink-500",
    lgOffset: "lg:mt-8",
  },
  {
    accentText: "text-pink-500",
    accentBg: "bg-pink-500",
    accentBorder: "border-pink-500",
    accentHoverBg: "group-hover:bg-pink-500",
    accentRule: "from-pink-500",
    coverFrom: "from-pink-500",
    coverTo: "to-pink-400",
    lgOffset: "lg:mt-0",
  },
];

/** Theme for a zero-based position in the progression. Wraps past four. */
export function sectorTheme(index) {
  const safe = Number.isFinite(index) && index >= 0 ? index : 0;
  return THEMES[safe % THEMES.length];
}

/**
 * Theme for an event card, which only knows its sector's displayOrder rather
 * than its position in a fetched list. displayOrder is 1-based.
 */
export function themeForDisplayOrder(displayOrder) {
  return sectorTheme((displayOrder ?? 1) - 1);
}

/**
 * Merge a CMS sector with its presentation tokens and the derived bits that
 * come from position: the step number and the route.
 */
export function decorateSector(sector, index) {
  return {
    ...sector,
    ...sectorTheme(index),
    step: String(index + 1).padStart(2, "0"),
    to: `/sectors/${sector.slug}`,
  };
}
