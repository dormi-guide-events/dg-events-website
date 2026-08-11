import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { FilterPills } from "../components/FilterPills.jsx";
import { SanityImage } from "../components/SanityImage.jsx";
import { Lightbox } from "../components/Lightbox.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { useAsyncData } from "../hooks/useAsyncData.js";
import {
  fetchGalleryEventFilters,
  fetchGalleryImages,
} from "../lib/gallery.js";

// The first row is likely above the fold on most screens, so those load
// eagerly and everything after them waits until it is scrolled towards.
const EAGER_COUNT = 4;

export function Gallery() {
  const [searchParams] = useSearchParams();
  const eventSlug = searchParams.get("event") || null;
  const [openIndex, setOpenIndex] = useState(null);

  const { status, data } = useAsyncData(
    () => fetchGalleryImages({ event: eventSlug, limit: 60 }),
    [eventSlug],
  );
  const { data: filterEvents } = useAsyncData(fetchGalleryEventFilters, []);

  const images = data ?? [];
  const events = filterEvents ?? [];
  const activeEvent = events.find((candidate) => candidate.slug === eventSlug);

  const closeLightbox = useCallback(() => setOpenIndex(null), []);
  const changeIndex = useCallback((next) => setOpenIndex(next), []);

  const filterOptions = [
    { value: null, label: "All photos" },
    ...events.map((candidate) => ({
      value: candidate.slug,
      label: candidate.title,
    })),
  ];

  return (
    <>
      <PageMeta
        title="Gallery"
        description="Photographs from Dormi Guide Events conferences, placement fairs, talent showcases and investor mixers across Ghana."
      />

      <PageHeader
        eyebrow="Gallery"
        title="What these rooms actually look like."
        lead="Photographs from our conferences, fairs, showcases and mixers."
      >
        {events.length > 0 && (
          <FilterPills
            label="Filter photos by event"
            basePath="/gallery"
            paramName="event"
            options={filterOptions}
            active={eventSlug}
          />
        )}
      </PageHeader>

      <section
        aria-labelledby="gallery-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div
          className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8"
          aria-busy={status === "loading"}
        >
          <h2 id="gallery-heading" className="sr-only">
            {activeEvent ? `Photos from ${activeEvent.title}` : "All photos"}
          </h2>

          {status === "loading" && (
            <>
              <p role="status" className="sr-only">
                Loading photographs…
              </p>
              <ul
                aria-hidden="true"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              >
                {Array.from({ length: 8 }, (_, index) => (
                  <li
                    key={index}
                    className="aspect-square animate-pulse rounded-xl bg-purple-900/10"
                  />
                ))}
              </ul>
            </>
          )}

          {status === "error" && (
            <EmptyState
              heading="We could not load the gallery"
              body="Something went wrong at our end. Give it a moment and refresh — the photographs are still there."
            />
          )}

          {status === "ready" && images.length === 0 && (
            <EmptyState
              heading={
                eventSlug
                  ? "No photographs from this event yet"
                  : "The gallery is still being filled"
              }
              body={
                eventSlug
                  ? "Pictures from this one have not been added yet. Browse everything else in the meantime."
                  : "We are gathering photographs from our events. Check back shortly, or come along to the next one and be in them."
              }
              actionLabel={eventSlug ? "See all photos" : "See what is coming up"}
              actionTo={eventSlug ? "/gallery" : "/events"}
            />
          )}

          {status === "ready" && images.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((photo, index) => (
                <li key={photo._id}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    className="group block w-full overflow-hidden rounded-xl border border-purple-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                  >
                    <SanityImage
                      image={photo.image}
                      loading={index < EAGER_COUNT ? "eager" : "lazy"}
                      sizes="(min-width: 1024px) 264px, (min-width: 640px) 33vw, 50vw"
                      widths={[240, 320, 480, 640]}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="sr-only">
                      Open photo {index + 1} of {images.length}
                      {photo.caption ? `: ${photo.caption}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Lightbox
        images={images}
        index={openIndex}
        onClose={closeLightbox}
        onIndexChange={changeIndex}
      />

      <ClosingCta />
    </>
  );
}
