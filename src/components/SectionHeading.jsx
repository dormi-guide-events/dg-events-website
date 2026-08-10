import { Reveal } from "./Reveal.jsx";
import { eyebrow as eyebrowClasses } from "../lib/ui.js";

/**
 * The eyebrow / heading / lead stack every section on the site opens with.
 * `action` sits on the right from `sm` up, for section-level links such as
 * "All events".
 */
export function SectionHeading({ id, eyebrow, title, lead, action }) {
  return (
    <Reveal
      className={
        action
          ? "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          : "max-w-2xl"
      }
    >
      <div className={action ? "max-w-xl" : undefined}>
        <p className={eyebrowClasses}>{eyebrow}</p>
        <h2 id={id} className="mt-5 text-3xl text-purple-900 md:text-4xl">
          {title}
        </h2>
        {lead && (
          <p className="mt-5 text-base leading-relaxed text-grey-500">{lead}</p>
        )}
      </div>
      {action}
    </Reveal>
  );
}
