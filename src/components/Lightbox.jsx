import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SanityImage } from "./SanityImage.jsx";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen photo viewer.
 *
 * While open it owns the keyboard: Escape closes, the arrow keys move between
 * photos, Tab cycles inside the dialog, and focus returns to the thumbnail
 * that opened it on the way out.
 *
 * The current index is held in a ref as well as a prop so the key handler
 * never needs re-binding — re-running the effect on every navigation would
 * restore focus to the trigger mid-browse.
 */
export function Lightbox({ images, index, onClose, onIndexChange }) {
  const panelRef = useRef(null);
  const indexRef = useRef(index);
  const reduceMotion = useReducedMotion();

  indexRef.current = index;

  const isOpen = index !== null && Boolean(images[index]);
  const count = images.length;

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement;
    const focusables = () => Array.from(panel.querySelectorAll(FOCUSABLE));
    focusables()[0]?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowRight" && count > 1) {
        event.preventDefault();
        onIndexChange((indexRef.current + 1) % count);
        return;
      }

      if (event.key === "ArrowLeft" && count > 1) {
        event.preventDefault();
        onIndexChange((indexRef.current - 1 + count) % count);
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
    // Deliberately keyed on open/close only — see the note above.
  }, [isOpen, count, onClose, onIndexChange]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.25 };

  const photo = isOpen ? images[index] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-[70]"
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          <motion.div
            aria-hidden="true"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={transition}
            onClick={onClose}
            className="absolute inset-0 bg-purple-900/95 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            variants={
              reduceMotion
                ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                : {
                    hidden: { opacity: 0, scale: 0.98 },
                    visible: { opacity: 1, scale: 1 },
                  }
            }
            transition={transition}
            className="absolute inset-0 flex flex-col"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
              <p
                aria-live="polite"
                className="text-sm font-medium text-off-white/80"
              >
                Photo {index + 1} of {count}
              </p>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close photo viewer"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-off-white transition-colors hover:bg-off-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center gap-2 px-2 md:gap-4 md:px-6">
              {count > 1 && (
                <button
                  type="button"
                  onClick={() => onIndexChange((index - 1 + count) % count)}
                  aria-label="Previous photo"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-off-white transition-colors hover:bg-off-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
              )}

              <figure className="flex min-h-0 flex-1 flex-col items-center justify-center">
                <SanityImage
                  key={photo._id}
                  image={photo.image}
                  loading="eager"
                  sizes="100vw"
                  widths={[640, 960, 1280, 1600]}
                  className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
                />
                {(photo.caption || photo.event?.title) && (
                  <figcaption className="mt-5 max-w-2xl px-2 text-center text-sm text-off-white/80">
                    {photo.caption}
                    {photo.caption && photo.event?.title ? " · " : ""}
                    {photo.event?.title}
                  </figcaption>
                )}
              </figure>

              {count > 1 && (
                <button
                  type="button"
                  onClick={() => onIndexChange((index + 1) % count)}
                  aria-label="Next photo"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-off-white transition-colors hover:bg-off-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            <div className="h-6" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
