import { GradientRing } from "./GradientRing.jsx";
import { primaryButton, secondaryButton, eyebrow } from "../lib/ui.js";

/**
 * Typographic hero — no photograph. The headline itself does the work, with
 * the logo's purple→pink gradient running through the second line and the
 * circular mark echoed as a ring bleeding off the top right.
 *
 * Deliberately unanimated: it is the first thing on screen, and a fade-in on
 * the fold is the one piece of motion that buys nothing.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <GradientRing className="absolute -top-28 -right-28 h-[26rem] w-[26rem] opacity-20 md:-top-40 md:-right-20 md:h-[40rem] md:w-[40rem]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-20 md:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <p className={eyebrow}>Dormi Guide Events · Accra, Ghana</p>

        <h1
          id="hero-heading"
          className="mt-6 max-w-4xl text-4xl leading-[1.06] text-purple-900 sm:text-5xl lg:text-7xl"
        >
          Events that move{" "}
          <span className="block bg-linear-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent">
            young Ghanaians forward.
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-grey-500 md:text-lg">
          From lecture halls to boardrooms, we bring students, graduates,
          workers and entrepreneurs into rooms built for where they are now —
          and where they are going next.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#sectors" className={primaryButton}>
            Find your sector
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </a>
          <a href="#upcoming" className={secondaryButton}>
            See what is coming up
          </a>
        </div>
      </div>
    </section>
  );
}
