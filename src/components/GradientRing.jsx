import { useId } from "react";

/**
 * The logo's circular mark, reduced to a decorative outline. The hero and the
 * closing call to action both drew this by hand; it lives here now so the
 * motif stays identical wherever it appears.
 *
 * The gradient needs a document-unique id, and useId's output contains
 * characters that are awkward inside url(#…), so it is stripped to word
 * characters first.
 */
export function GradientRing({ className = "" }) {
  const id = `ring-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className={`pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#400080" />
          <stop offset="100%" stopColor="#E0417F" />
        </linearGradient>
      </defs>
      <circle
        cx="200"
        cy="200"
        r="190"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="1.5"
      />
      <circle
        cx="200"
        cy="200"
        r="148"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="1"
        strokeDasharray="3 12"
        strokeLinecap="round"
      />
    </svg>
  );
}
