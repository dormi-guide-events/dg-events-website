import { Link } from "react-router-dom";
import { Reveal } from "./Reveal.jsx";
import { getOtherSectors } from "../lib/sectors.js";

/**
 * Cross-navigation at the foot of a sector page. Keeps the progression order
 * and each sector's accent so moving between them still feels like moving
 * along the same line.
 */
export function SectorNav({ currentSlug }) {
  const others = getOtherSectors(currentSlug);

  return (
    <section
      aria-labelledby="other-sectors-heading"
      className="border-t border-purple-900/10 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2
            id="other-sectors-heading"
            className="text-2xl text-purple-900 md:text-3xl"
          >
            Not the stage you are at?
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {others.map((sector, index) => (
            <li key={sector.slug}>
              <Reveal delay={index * 0.06}>
                <Link
                  to={sector.to}
                  className="group block rounded-lg transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-0.5 w-full bg-linear-to-r to-transparent ${sector.accentRule}`}
                  />
                  <p className={`mt-5 font-serif text-2xl ${sector.accentText}`}>
                    {sector.step}
                  </p>
                  <h3 className="mt-2 font-serif text-lg text-purple-900">
                    {sector.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-purple-700">
                    {sector.remit}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700">
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
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
