import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MobileMenu } from "./MobileMenu.jsx";
import { mainNav } from "../lib/navigation.js";
import logo from "../assets/logo.jpeg";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);

    handleScroll(); // A reload part-way down the page starts in the right state.
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigating away always closes the menu, however the link was reached.
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "border-purple-900/10 bg-off-white/95 shadow-sm backdrop-blur-md"
            : "border-transparent bg-off-white"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link
            to="/"
            className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
          >
            <img
              src={logo}
              alt="Dormi Guide Events"
              className="h-12 w-auto md:h-14"
            />
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {mainNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        "relative block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500",
                        isActive
                          ? "text-pink-500"
                          : "text-charcoal hover:text-purple-700",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-3 bottom-0.5 h-0.5 rounded-full bg-linear-to-r from-purple-700 to-pink-500 transition-opacity duration-200 ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close main menu" : "Open main menu"}
            className="relative h-11 w-11 rounded-lg text-purple-700 transition-colors hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 md:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute top-1/2 left-1/2 -mt-px h-0.5 w-6 -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ${
                menuOpen ? "rotate-45" : "-translate-y-2"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute top-1/2 left-1/2 -mt-px h-0.5 w-6 -translate-x-1/2 rounded-full bg-current transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute top-1/2 left-1/2 -mt-px h-0.5 w-6 -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ${
                menuOpen ? "-rotate-45" : "translate-y-2"
              }`}
            />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
}
