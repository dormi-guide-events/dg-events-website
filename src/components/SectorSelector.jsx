import { Reveal } from "./Reveal.jsx";
import { SectionHeading } from "./SectionHeading.jsx";
import { SectorCard } from "./SectorCard.jsx";
import { sectors } from "../lib/sectors.js";

/**
 * The page's signature element, and the only place boldness is spent.
 *
 * An ordered list, because it genuinely is a sequence. On mobile a gradient
 * rail runs down the left with a node per sector; from `lg` the rail resolves
 * into four accent-coloured rules that step upward across the row. Both read
 * as forward movement rather than four identical boxes.
 */
export function SectorSelector() {
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

        <ol className="relative mt-14 lg:mt-24 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-4 w-0.5 -translate-x-1/2 bg-linear-to-b from-purple-900 via-purple-500 to-pink-500 lg:hidden"
          />

          {sectors.map((sector, index) => (
            <li
              key={sector.slug}
              className={`relative pb-12 pl-12 last:pb-0 lg:pb-0 lg:pl-0 ${sector.lgOffset}`}
            >
              <Reveal delay={index * 0.06}>
                <SectorCard sector={sector} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
