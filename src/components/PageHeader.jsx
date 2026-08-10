import { GradientRing } from "./GradientRing.jsx";
import { eyebrow as eyebrowClasses } from "../lib/ui.js";

/**
 * The h1 header for interior pages. Same type treatment and ring motif as the
 * home hero, at a slightly quieter scale — the home page keeps the biggest
 * setting for itself.
 *
 * `accentRule` takes a sector's gradient-from class so a sector page announces
 * which one you are on before the words do.
 */
export function PageHeader({ eyebrow, title, lead, accentRule, children }) {
  return (
    <section aria-labelledby="page-heading" className="relative overflow-hidden">
      <GradientRing className="absolute -top-28 -right-28 h-[24rem] w-[24rem] opacity-20 md:-top-36 md:-right-20 md:h-[34rem] md:w-[34rem]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-14 pb-14 md:px-6 lg:px-8 lg:pt-20 lg:pb-20">
        {accentRule && (
          <span
            aria-hidden="true"
            className={`mb-7 block h-0.5 w-16 bg-linear-to-r to-transparent ${accentRule}`}
          />
        )}

        <p className={eyebrowClasses}>{eyebrow}</p>

        <h1
          id="page-heading"
          className="mt-6 max-w-3xl text-4xl leading-[1.08] text-purple-900 sm:text-5xl lg:text-6xl"
        >
          {title}
        </h1>

        {lead && (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-grey-500 md:text-lg">
            {lead}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
