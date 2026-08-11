import { useParams } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { FeatureGrid } from "../components/FeatureGrid.jsx";
import { EventList } from "../components/EventList.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { SectorNav } from "../components/SectorNav.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { useSector } from "../hooks/useSectors.js";
import { NotFound } from "./NotFound.jsx";

/**
 * One template for all four sector pages, driven entirely by the CMS. Adding
 * a fifth sector means adding a document — no new component, no new route.
 */
export function SectorPage() {
  const { slug } = useParams();
  const { status, sector, others } = useSector(slug);

  if (status === "loading") {
    return (
      <div
        className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 lg:px-8"
        aria-busy="true"
      >
        <p role="status" className="sr-only">
          Loading sector…
        </p>
        <div aria-hidden="true" className="space-y-4">
          <div className="h-0.5 w-16 animate-pulse bg-purple-900/10" />
          <div className="h-3 w-52 animate-pulse rounded-full bg-purple-900/10" />
          <div className="h-12 w-3/4 animate-pulse rounded-lg bg-purple-900/10" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-purple-900/10" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 lg:px-8">
        <PageMeta
          title="Sector"
          description="Events from Dormi Guide Events for students, graduates, workers and entrepreneurs across Ghana."
        />
        <EmptyState
          heading="We could not load this sector"
          body="Something went wrong at our end. Refresh in a moment, or call us and we will tell you what this guide covers."
        />
      </div>
    );
  }

  // Only a genuine 404 once loading has finished.
  if (!sector) return <NotFound />;

  const formats = (sector.eventFormats ?? []).map((format) => ({
    title: format.name,
    body: format.description,
  }));

  return (
    <>
      <PageMeta
        title={sector.title}
        description={sector.shortDescription || sector.headline || sector.title}
      />

      <PageHeader
        accentRule={sector.accentRule}
        eyebrow={`Sector ${sector.step} · ${sector.remit}`}
        title={sector.title}
        lead={sector.headline}
      >
        {sector.purpose && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-grey-500">
            {sector.purpose}
          </p>
        )}
      </PageHeader>

      {formats.length > 0 && (
        <section
          aria-labelledby="formats-heading"
          className="border-t border-purple-900/10 py-16 md:py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
            <SectionHeading
              id="formats-heading"
              eyebrow="What we run"
              title="Formats built for this stage."
            />
            <FeatureGrid items={formats} columns={3} numbered />
          </div>
        </section>
      )}

      <section
        aria-labelledby="sector-events-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="sector-events-heading"
            eyebrow="Coming up"
            title="Upcoming in this sector."
          />

          <EventList
            sector={sector.slug}
            limit={3}
            emptyHeading="Nothing scheduled here just yet"
            emptyBody={`We are working on the next ${sector.title} dates. Tell us you are interested and we will make sure you hear first.`}
          />
        </div>
      </section>

      <SectorNav sectors={others} />

      <ClosingCta />
    </>
  );
}
