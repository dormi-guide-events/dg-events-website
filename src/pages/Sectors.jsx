import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { sectors } from "../lib/sectors.js";

/**
 * The overview keeps the home page's grammar — progression order, step
 * numbers, the accent ramp — but lays it out as a stacked index rather than
 * repeating the ascending rail. Same language, different sentence.
 */
export function Sectors() {
  return (
    <>
      <PageMeta
        title="The Four Sectors"
        description="Four sectors, one progression. Explore the events Dormi Guide Events runs for students, graduates, workers and entrepreneurs across Ghana."
      />

      <PageHeader
        eyebrow="Our work"
        title="Four sectors, one progression."
        lead="Student, graduate, worker, entrepreneur. Each stage gets its own programme, because each one is asking a different question."
      />

      <section
        aria-labelledby="sector-index-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <h2 id="sector-index-heading" className="sr-only">
            All four sectors
          </h2>

          <ol>
            {sectors.map((sector, index) => (
              <li
                key={sector.slug}
                className="border-t border-purple-900/10 py-10 first:border-t-0 first:pt-0 md:py-12"
              >
                <Reveal delay={index * 0.05}>
                  <Link
                    to={sector.to}
                    className="group grid gap-5 rounded-lg md:grid-cols-[7rem_1fr] md:gap-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
                  >
                    <div>
                      <p
                        className={`font-serif text-4xl md:text-5xl ${sector.accentText}`}
                      >
                        {sector.step}
                      </p>
                      <span
                        aria-hidden="true"
                        className={`mt-4 hidden h-0.5 w-full bg-linear-to-r to-transparent md:block ${sector.accentRule}`}
                      />
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl text-purple-900 md:text-3xl">
                        {sector.name}
                      </h3>
                      <p className="mt-1.5 text-sm font-medium text-purple-700">
                        {sector.remit}
                      </p>
                      <p className="mt-4 max-w-2xl text-base leading-relaxed text-grey-500">
                        {sector.blurb}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {sector.formats.map((format) => (
                          <li
                            key={format.name}
                            className="flex items-center gap-2 text-sm text-charcoal"
                          >
                            <span
                              aria-hidden="true"
                              className={`h-1 w-1 shrink-0 rounded-full ${sector.accentBg}`}
                            />
                            {format.name}
                          </li>
                        ))}
                      </ul>

                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700">
                        Explore {sector.name}
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
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
