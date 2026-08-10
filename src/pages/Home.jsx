import { PageMeta } from "../components/PageMeta.jsx";
import { Hero } from "../components/Hero.jsx";
import { SectorSelector } from "../components/SectorSelector.jsx";
import { Objectives } from "../components/Objectives.jsx";
import { UpcomingEvents } from "../components/UpcomingEvents.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";

export function Home() {
  return (
    <>
      <PageMeta
        title="Events for young Ghanaians"
        description="Dormi Guide Events runs targeted events across Ghana for students, graduates, workers and entrepreneurs — built for where you are now, and where you are going next."
      />
      <Hero />
      <SectorSelector />
      <Objectives />
      <UpcomingEvents />
      <ClosingCta />
    </>
  );
}
