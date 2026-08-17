import { PageMeta } from "../components/PageMeta.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { ContactForm } from "../components/ContactForm.jsx";
import { useAsyncData } from "../hooks/useAsyncData.js";
import { fetchSiteSettings } from "../lib/settings.js";
import { telHref } from "../lib/phone.js";

// Only the platforms the Studio offers, in the order they appear there.
const PLATFORM_LABELS = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
  tiktok: "TikTok",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};


export function Contact() {
  const { status, data: settings } = useAsyncData(fetchSiteSettings, []);

  const hasDetails =
    settings &&
    (settings.contactEmail ||
      settings.phone ||
      settings.address ||
      settings.socialLinks?.length);

  return (
    <>
      <PageMeta
        title="Contact"
        description="Get in touch with Dormi Guide Events in Accra — reserve a seat at an upcoming event, or talk to us about running one with you."
      />

      <PageHeader
        eyebrow="Contact"
        title="Tell us where you are."
        lead="Reserving a seat, asking about a programme, or wanting to run something with us — this all reaches the same people."
      />

      <section
        aria-label="Contact Dormi Guide Events"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <aside className="lg:col-start-3 lg:row-start-1">
              <h2 className="font-serif text-2xl text-purple-900">
                Reach us directly
              </h2>

              <div aria-busy={status === "loading"} className="mt-6">
                {status === "loading" && (
                  <>
                    <p role="status" className="sr-only">
                      Loading contact details…
                    </p>
                    <div aria-hidden="true" className="space-y-3">
                      <div className="h-4 w-40 animate-pulse rounded-full bg-purple-900/10" />
                      <div className="h-4 w-52 animate-pulse rounded-full bg-purple-900/10" />
                      <div className="h-4 w-32 animate-pulse rounded-full bg-purple-900/10" />
                    </div>
                  </>
                )}

                {status !== "loading" && !hasDetails && (
                  <p className="text-sm leading-relaxed text-grey-500">
                    Our contact details are being set up. Use the form and we
                    will come back to you.
                  </p>
                )}

                {status === "ready" && hasDetails && (
                  <dl className="space-y-5 text-sm">
                    {settings.phone && telHref(settings.phone) && (
                      <div>
                        <dt className="font-semibold text-purple-700">Phone</dt>
                        <dd className="mt-1">
                          <a
                            href={telHref(settings.phone)}
                            className="rounded-sm text-charcoal transition-colors hover:text-purple-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                          >
                            {settings.phone}
                          </a>
                        </dd>
                      </div>
                    )}

                    {settings.contactEmail && (
                      <div>
                        <dt className="font-semibold text-purple-700">Email</dt>
                        <dd className="mt-1">
                          <a
                            href={`mailto:${settings.contactEmail}`}
                            className="rounded-sm break-words text-charcoal transition-colors hover:text-purple-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                          >
                            {settings.contactEmail}
                          </a>
                        </dd>
                      </div>
                    )}

                    {settings.address && (
                      <div>
                        <dt className="font-semibold text-purple-700">
                          Address
                        </dt>
                        <dd className="mt-1 whitespace-pre-line text-charcoal">
                          {settings.address}
                        </dd>
                      </div>
                    )}

                    {settings.socialLinks?.length > 0 && (
                      <div>
                        <dt className="font-semibold text-purple-700">
                          Follow us
                        </dt>
                        <dd className="mt-2">
                          <ul className="flex flex-wrap gap-x-4 gap-y-2">
                            {settings.socialLinks.map((link) => (
                              <li key={link._key}>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-sm text-charcoal underline decoration-pink-500 underline-offset-4 transition-colors hover:text-purple-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                                >
                                  {PLATFORM_LABELS[link.platform] ||
                                    link.platform}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            </aside>

            <div className="mt-12 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mt-0">
              <SectionHeading
                id="form-heading"
                eyebrow="Send a message"
                title="Or write to us here."
                lead="Everything is required so we can reply properly."
              />
              {/* Both come from the siteSettings singleton. When that document
                  does not exist they are undefined, and the form's failure
                  state drops the "call us" line rather than guessing. */}
              <ContactForm
                phone={settings?.phone}
                contactEmail={settings?.contactEmail}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
