// The site's fixed navigation, shared by the header, the mobile menu and the
// footer so the three can never drift apart.
//
// The sector links are deliberately not here — they come from the CMS via
// useSectors(), so adding or renaming a sector never needs a code change.

export const mainNav = [
  // `end` keeps "/" from matching every route.
  { label: "Home", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Sectors", to: "/sectors" },
  { label: "Events", to: "/events" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];
