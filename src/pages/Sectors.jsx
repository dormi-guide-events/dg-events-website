import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { useSectors } from "../hooks/useSectors.js";

/**
 * The overview keeps the home page's grammar — progression order, step
 * numbers, the accent ramp — but lays it out as a stacked index rather than
 * repeating the ascending rail. Same language, different sentence.
 */
export function Sectors() {
  const { status, sectors } = useSectors();

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
        <div
          className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8"
          aria-busy={status === "loading"}
        >
          <h2 id="sector-index-heading" className="sr-only">
            All four sectors
          </h2>

          {status === "loading" && (
            <>
              <p role="status" className="sr-only">
                Loading sectors…
              </p>
              <div aria-hidden="true">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="space-y-3 border-t border-purple-900/10 py-10 first:border-t-0 first:pt-0 md:py-12"
                  >
                    <div className="h-10 w-14 animate-pulse rounded bg-purple-900/10" />
                    <div className="h-7 w-2/3 animate-pulse rounded-full bg-purple-900/10" />
                    <div className="h-3 w-1/3 animate-pulse rounded-full bg-purple-900/10" />
                    <div className="h-3 w-full animate-pulse rounded-full bg-purple-900/10" />
                  </div>
                ))}
              </div>
            </>
          )}

          {status === "error" && (
            <EmptyState
              heading="We could not load the sectors"
              body="Something went wrong at our end. Refresh in a moment, or call us and we will point you to the right programme."
            />
          )}

          {status === "ready" && sectors.length === 0 && (
            <EmptyState
              heading="Our programmes are being updated"
              body="The four guides are being rewritten at the moment. Tell us which stage you are at and we will send you the details directly."
            />
          )}

          {status === "ready" && sectors.length > 0 && (
            <ol>
              {sectors.map((sector, index) => (
                <li
                  key={sector._id}
                  className="border-t border-purple-900/10 py-10 first:border-t-0 first:pt-0 md:py-12"
                >
                  <Reveal delay={index * 0.05}>
                    <Link
                      to={sector.to}
                      className="group grid gap-5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500 md:grid-cols-[7rem_1fr] md:gap-10"
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
                          {sector.title}
                        </h3>
                        {sector.remit && (
                          <p className="mt-1.5 text-sm font-medium text-purple-700">
                            {sector.remit}
                          </p>
                        )}
                        {sector.shortDescription && (
                          <p className="mt-4 max-w-2xl text-base leading-relaxed text-grey-500">
                            {sector.shortDescription}
                          </p>
                        )}

                        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                          {(sector.eventFormats ?? []).map((format) => (
                            <li
                              key={format._key}
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
                          Explore {sector.title}
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
          )}
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
