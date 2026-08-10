import { Link } from "react-router-dom";
import { Reveal } from "./Reveal.jsx";
import { GradientRing } from "./GradientRing.jsx";
import { primaryButton, secondaryButton } from "../lib/ui.js";

/**
 * Deliberately on off-white rather than purple-900: the footer directly below
 * is already deep purple, and stacking the two would fuse them into a single
 * dark block. The page ends light and the footer closes it.
 */
export function ClosingCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-purple-900/10 py-20 md:py-28"
    >
      <GradientRing className="absolute top-1/2 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 opacity-20 md:h-[30rem] md:w-[30rem]" />

      <div className="relative mx-auto w-full max-w-2xl px-4 text-center md:px-6">
        <Reveal>
          <h2
            id="cta-heading"
            className="text-3xl leading-tight text-purple-900 md:text-5xl"
          >
            Come and find your people.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-grey-500">
            Whether you are picking a course, chasing a first role, steadying
            your finances or raising your first round — there is a room for
            that. Tell us where you are and we will point you to the right one.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/contact" className={primaryButton}>
              Start a conversation
            </Link>
            <a href="tel:+233532592824" className={secondaryButton}>
              +233 (0) 53 259 2824
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
