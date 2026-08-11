import { Link } from "react-router-dom";

/**
 * One step of the progression. The node is a single element that lands on the
 * vertical rail on mobile and on the card's own top rule from `lg` up:
 *
 *   mobile   li has pl-12 (48px), node at -left-10 (-40px) → centre at 16px,
 *            which is exactly where the rail sits (left-4, -translate-x-1/2).
 *   lg       rail is gone, node moves onto the 2px rule at the card's top.
 *
 * `sector` arrives already merged with its theme by decorateSector().
 */
export function SectorCard({ sector }) {
  return (
    <Link
      to={sector.to}
      className="group relative block rounded-lg transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
    >
      <span
        aria-hidden="true"
        className={`hidden h-0.5 w-full bg-linear-to-r to-transparent lg:block ${sector.accentRule}`}
      />

      <span
        aria-hidden="true"
        className={`absolute top-2 -left-10 h-4 w-4 rounded-full border-2 bg-off-white transition-colors duration-300 lg:top-[-7px] lg:left-0 ${sector.accentBorder} ${sector.accentHoverBg}`}
      />

      <p className={`font-serif text-3xl lg:mt-7 lg:text-4xl ${sector.accentText}`}>
        {sector.step}
      </p>

      <h3 className="mt-3 font-serif text-xl text-purple-900 md:text-2xl">
        {sector.title}
      </h3>

      {sector.remit && (
        <p className="mt-1.5 text-sm font-medium text-purple-700">
          {sector.remit}
        </p>
      )}

      {sector.shortDescription && (
        <p className="mt-3 text-sm leading-relaxed text-grey-500">
          {sector.shortDescription}
        </p>
      )}

      <ul className="mt-5 space-y-2">
        {(sector.eventFormats ?? []).map((format) => (
          <li key={format._key} className="flex gap-2.5 text-sm text-charcoal">
            <span
              aria-hidden="true"
              className={`mt-2 h-1 w-1 shrink-0 rounded-full ${sector.accentBg}`}
            />
            {format.name}
          </li>
        ))}
      </ul>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700">
        Explore
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
        </svg>
      </span>
    </Link>
  );
}
