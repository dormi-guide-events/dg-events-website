import { Link } from "react-router-dom";
import { secondaryButton } from "../lib/ui.js";

/**
 * The "there is nothing here" block, lifted out of the events list so every
 * empty and failed state on the site looks the same.
 *
 * This site will genuinely have quiet stretches with no upcoming events, so
 * this is a designed state rather than a fallback: it says what is happening,
 * why, and gives the visitor something to do about it.
 */
export function EmptyState({
  heading,
  body,
  actionLabel = "Get in touch",
  actionTo = "/contact",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-purple-900/20 bg-pink-100/50 px-6 py-14 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-700 to-pink-500"
      >
        <span className="h-5 w-5 rounded-full bg-off-white" />
      </span>
      <h3 className="mt-5 font-serif text-xl text-purple-900">{heading}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-grey-500">
        {body}
      </p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className={`${secondaryButton} mt-7 border-purple-900/20 bg-off-white`}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
