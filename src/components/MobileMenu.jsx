import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { mainNav } from "../lib/navigation.js";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // While the menu is open it owns the keyboard: Escape closes it, Tab cycles
  // inside the panel, and focus returns to whatever opened it on the way out.
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
  }, [isOpen, onClose]);

  // Reduced motion gets a plain cross-fade instead of the slide.
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.3 };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { x: "100%" }, visible: { x: 0 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-[60] md:hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          <motion.div
            aria-hidden="true"
            variants={backdropVariants}
            transition={transition}
            onClick={onClose}
            className="absolute inset-0 bg-purple-900/60 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            variants={panelVariants}
            transition={transition}
            className="absolute inset-y-0 right-0 flex w-[85%] max-w-xs flex-col bg-off-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-purple-900/10 px-5 py-4">
              <span className="text-sm font-semibold tracking-[0.2em] text-purple-700 uppercase">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close main menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-purple-700 transition-colors hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
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

            <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="flex flex-col gap-1">
                {mainNav.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-lg transition-colors",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500",
                          isActive
                            ? "bg-pink-100 font-semibold text-purple-700"
                            : "text-charcoal hover:bg-pink-100/60 hover:text-purple-700",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            aria-hidden="true"
                            className={`h-6 w-0.5 rounded-full bg-linear-to-b from-purple-700 to-pink-500 transition-opacity ${
                              isActive ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="border-t border-purple-900/10 px-7 py-4 text-sm text-grey-500">
              Events that unlock potential in young Ghanaians.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
