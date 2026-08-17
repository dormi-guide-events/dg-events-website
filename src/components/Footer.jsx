import { Link } from "react-router-dom";
import { mainNav } from "../lib/navigation.js";
import { useSectors } from "../hooks/useSectors.js";
import logo from "../assets/logo-192.png";

// The label is how the number reads in Ghana; the href has to be a bare E.164
// string or the handset will not dial it.
const contactDetails = [
  { label: "Accra, Ghana", href: null },
  { label: "+233 (0) 53 259 2824", href: "tel:+233532592824" },
  { label: "dormiguideevents@gmail.com", href: "mailto:dormiguideevents@gmail.com" },
];

// TODO: swap the placeholder "#" hrefs for the real profiles.
const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const linkClasses =
  "rounded-sm text-sm text-off-white/75 transition-colors hover:text-pink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400";

const headingClasses =
  "mb-4 font-sans text-xs font-semibold tracking-[0.18em] text-pink-400 uppercase";

export function Footer() {
  const year = new Date().getFullYear();
  // Shares the cached sectors request with the rest of the page, so the footer
  // costs no extra round trip. If it fails, the column simply does not render
  // rather than breaking the footer.
  const { status, sectors } = useSectors();

  return (
    <footer className="mt-auto bg-purple-900 text-off-white">
      <div
        aria-hidden="true"
        className="h-1 w-full bg-linear-to-r from-purple-700 to-pink-500"
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link
              to="/"
              className="inline-block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-400"
            >
              <img
                src={logo}
                alt="Dormi Guide Events"
                width={192}
                height={192}
                className="h-16 w-auto rounded-xl bg-white p-1.5"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-off-white/75">
              Dormi Guide Events is a Ghanaian event-led organisation built to
              unlock the potential of young people — students, graduates,
              workers and entrepreneurs — through gatherings that teach,
              connect and open doors.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={`DG Events on ${social.label}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-off-white/10 text-off-white transition-colors hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={headingClasses}>
              Explore
            </h2>
            <ul className="flex flex-col gap-3">
              {mainNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClasses}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Rendered even while the sectors are still in flight, with
              placeholder rows holding the exact space the real links will
              occupy. Without this the footer jumped down the moment they
              arrived — the single largest layout shift on the site. */}
          {(status === "loading" || sectors.length > 0) && (
            <nav aria-labelledby="footer-sectors">
              <h2 id="footer-sectors" className={headingClasses}>
                Our sectors
              </h2>
              <ul className="flex flex-col gap-3">
                {status === "loading"
                  ? [0, 1, 2, 3].map((index) => (
                      <li key={index} aria-hidden="true" className="py-0.5">
                        <span className="block h-4 w-40 rounded-full bg-off-white/10" />
                      </li>
                    ))
                  : sectors.map((sector) => (
                      <li key={sector._id}>
                        <Link to={sector.to} className={linkClasses}>
                          {sector.title}
                        </Link>
                      </li>
                    ))}
              </ul>
            </nav>
          )}

          <div className="sm:col-span-2 lg:col-span-4">
            <h2 className={headingClasses}>Get in touch</h2>
            <ul className="flex flex-col gap-3 sm:flex-row sm:gap-8">
              {contactDetails.map((detail) => (
                <li key={detail.label} className="text-sm text-off-white/75">
                  {detail.href ? (
                    <a href={detail.href} className={linkClasses}>
                      {detail.label}
                    </a>
                  ) : (
                    detail.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-off-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-off-white/60 md:flex-row md:items-center md:justify-between md:px-6">
          <p>&copy; {year} Dormi Guide Events. All rights reserved.</p>
          <p>Accra, Ghana</p>
        </div>
      </div>
    </footer>
  );
}
