// Single source of truth for the site's navigation, shared by the header, the
// mobile menu and the footer so the three can never drift apart.

export const mainNav = [
  // `end` keeps "/" from matching every route.
  { label: "Home", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Sectors", to: "/sectors" },
  { label: "Events", to: "/events" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export const sectorNav = [
  { label: "Dormi Students Guide", to: "/sectors/students" },
  { label: "Dormi Graduates Guide", to: "/sectors/graduates" },
  { label: "Dormi Workers Guide", to: "/sectors/workers" },
  { label: "Dormi Entrepreneur Guide", to: "/sectors/entrepreneurs" },
];
