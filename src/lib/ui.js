// Shared class strings for the two button shapes used across the site, kept in
// one place so the hero and the closing call to action cannot drift apart.
//
// Note the primary fill is purple-700, not pink-500. Pink is the brand accent,
// but off-white on pink-500 only reaches 3.9:1 — fine for large display type,
// short of the 4.5:1 that button labels need. Pink carries the accent role in
// rules, nodes, gradients and headline type instead.

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-purple-700 px-6 py-3.5 text-sm font-semibold text-off-white transition-colors hover:bg-purple-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-purple-900/15 px-6 py-3.5 text-sm font-semibold text-purple-700 transition-colors hover:border-purple-700 hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

// The same shape for use on a purple-900 panel.
//
// This exists because appending `text-off-white` to secondaryButton did NOT
// work: both it and the base `text-purple-700` are single-class selectors, so
// the winner is decided by their order in the generated stylesheet, not by the
// order they appear in the class attribute. purple-700 won, which put
// purple-700 text on a purple-900 background at 1.22:1 — invisible.
// Never layer a text colour on top of one of these; add a variant instead.
export const secondaryButtonOnDark =
  "inline-flex items-center justify-center gap-2 rounded-full border border-off-white/25 px-6 py-3.5 text-sm font-semibold text-off-white transition-colors hover:border-off-white hover:bg-off-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400";

export const eyebrow =
  "text-xs font-semibold uppercase tracking-[0.2em] text-purple-700";
