import { PageMeta } from "../components/PageMeta.jsx";
import { JsonLd } from "../components/JsonLd.jsx";
import { Hero } from "../components/Hero.jsx";
import { SectorSelector } from "../components/SectorSelector.jsx";
import { Objectives } from "../components/Objectives.jsx";
import { UpcomingEvents } from "../components/UpcomingEvents.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { useAsyncData } from "../hooks/useAsyncData.js";
import { fetchSiteSettings } from "../lib/settings.js";
import { organizationSchema } from "../lib/structuredData.js";

export function Home() {
  // Only for the Organization markup — the contact details enrich it when the
  // singleton exists, and are left out entirely when it does not.
  const { data: settings } = useAsyncData(fetchSiteSettings, []);

  return (
    <>
      <PageMeta
        title="Events for young Ghanaians"
        description="Dormi Guide Events runs targeted events across Ghana for students, graduates, workers and entrepreneurs — built for where you are now, and where you are going next."
      />
      <JsonLd data={organizationSchema(settings)} />
      <Hero />
      <SectorSelector />
      <Objectives />
      <UpcomingEvents />
      <ClosingCta />
    </>
  );
}
