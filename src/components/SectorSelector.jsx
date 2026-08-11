import { Reveal } from "./Reveal.jsx";
import { SectionHeading } from "./SectionHeading.jsx";
import { SectorCard } from "./SectorCard.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { useSectors } from "../hooks/useSectors.js";
import { sectorTheme } from "../lib/sectorTheme.js";

/**
 * The page's signature element, and the only place boldness is spent.
 *
 * An ordered list, because it genuinely is a sequence. On mobile a gradient
 * rail runs down the left with a node per sector; from `lg` the rail resolves
 * into four accent-coloured rules that step upward across the row. Both read
 * as forward movement rather than four identical boxes.
 */
export function SectorSelector() {
  const { status, sectors } = useSectors();

  return (
    <section
      id="sectors"
      aria-labelledby="sectors-heading"
      className="scroll-mt-24 border-t border-purple-900/10 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          id="sectors-heading"
          eyebrow="Four sectors, one journey"
          title="Where are you right now?"
          lead="Every stage asks a different question. Start at the one you are standing in — the rest will still be here when you get there."
        />

        <div aria-busy={status === "loading"}>
          {status === "loading" && (
            <>
              <p role="status" className="sr-only">
                Loading sectors…
              </p>
              <ol className="relative mt-14 lg:mt-24 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
                <span
                  aria-hidden="true"
                  className="absolute top-4 bottom-4 left-4 w-0.5 -translate-x-1/2 bg-linear-to-b from-purple-900 via-purple-500 to-pink-500 lg:hidden"
                />
                {[0, 1, 2, 3].map((index) => (
                  <li
                    key={index}
                    aria-hidden="true"
                    className={`relative pb-12 pl-12 last:pb-0 lg:pb-0 lg:pl-0 ${sectorTheme(index).lgOffset}`}
                  >
                    <div className="space-y-3">
                      <div className="h-9 w-12 animate-pulse rounded bg-purple-900/10" />
                      <div className="h-6 w-3/4 animate-pulse rounded-full bg-purple-900/10" />
                      <div className="h-3 w-1/2 animate-pulse rounded-full bg-purple-900/10" />
                      <div className="h-3 w-full animate-pulse rounded-full bg-purple-900/10" />
                      <div className="h-3 w-5/6 animate-pulse rounded-full bg-purple-900/10" />
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}

          {status === "error" && (
            <div className="mt-14">
              <EmptyState
                heading="We could not load the sectors"
                body="Something went wrong at our end. Refresh in a moment, or call us and we will point you to the right programme."
              />
            </div>
          )}

          {status === "ready" && sectors.length === 0 && (
            <div className="mt-14">
              <EmptyState
                heading="Our programmes are being updated"
                body="The four guides are being rewritten at the moment. Tell us which stage you are at and we will send you the details directly."
              />
            </div>
          )}

          {status === "ready" && sectors.length > 0 && (
            <ol className="relative mt-14 lg:mt-24 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
              <span
                aria-hidden="true"
                className="absolute top-4 bottom-4 left-4 w-0.5 -translate-x-1/2 bg-linear-to-b from-purple-900 via-purple-500 to-pink-500 lg:hidden"
              />

              {sectors.map((sector, index) => (
                <li
                  key={sector._id}
                  className={`relative pb-12 pl-12 last:pb-0 lg:pb-0 lg:pl-0 ${sector.lgOffset}`}
                >
                  <Reveal delay={index * 0.06}>
                    <SectorCard sector={sector} />
                  </Reveal>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
