import { useParams } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { FeatureGrid } from "../components/FeatureGrid.jsx";
import { EventList } from "../components/EventList.jsx";
import { SectorNav } from "../components/SectorNav.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { getSector } from "../lib/sectors.js";
import { NotFound } from "./NotFound.jsx";

/**
 * One template for all four sector pages, driven entirely by
 * src/data/sectors.js. Adding a fifth sector means adding a data entry —
 * no new component, no new route.
 */
export function SectorPage() {
  const { slug } = useParams();
  const sector = getSector(slug);

  // /sectors/anything-else is a real 404, not an empty sector page.
  if (!sector) return <NotFound />;

  const formats = sector.formats.map((format) => ({
    title: format.name,
    body: format.description,
  }));

  return (
    <>
      <PageMeta title={sector.metaTitle} description={sector.metaDescription} />

      <PageHeader
        accentRule={sector.accentRule}
        eyebrow={`Sector ${sector.step} · ${sector.remit}`}
        title={sector.name}
        lead={sector.headline}
      >
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-grey-500">
          {sector.purpose}
        </p>
      </PageHeader>

      <section
        aria-labelledby="formats-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="formats-heading"
            eyebrow="What we run"
            title="Three formats, built for this stage."
          />
          <FeatureGrid items={formats} columns={3} numbered />
        </div>
      </section>

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
            emptyBody={`We are working on the next ${sector.name} dates. Tell us you are interested and we will make sure you hear first.`}
          />
        </div>
      </section>

      <SectorNav currentSlug={sector.slug} />

      <ClosingCta />
    </>
  );
}
