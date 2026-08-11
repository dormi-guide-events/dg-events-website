import { useSearchParams } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { FilterPills } from "../components/FilterPills.jsx";
import { EventList } from "../components/EventList.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { useSectors } from "../hooks/useSectors.js";

export function Events() {
  const [searchParams] = useSearchParams();
  const { sectors } = useSectors();

  // The filter lives in the URL, so a filtered view survives a refresh and can
  // be shared. The raw param drives the query rather than waiting for the
  // sector list to arrive — otherwise the page would flash the unfiltered
  // results first and fetch twice.
  const sector = searchParams.get("sector") || null;
  const activeSector = sectors.find((candidate) => candidate.slug === sector);
  const filterName = activeSector?.title;

  const filterOptions = [
    { value: null, label: "All events" },
    ...sectors.map((candidate) => ({
      value: candidate.slug,
      label: candidate.title,
    })),
  ];

  return (
    <>
      <PageMeta
        title="Events"
        description="Upcoming and past events from Dormi Guide Events — conferences, fairs, bootcamps and mixers for students, graduates, workers and entrepreneurs across Ghana."
      />

      <PageHeader
        eyebrow="What is on"
        title="Every room we are opening."
        lead="Upcoming dates first, then everything we have already run. Filter by the stage you are at."
      >
        <FilterPills
          label="Filter events by sector"
          basePath="/events"
          paramName="sector"
          options={filterOptions}
          active={sector}
        />
      </PageHeader>

      <section
        aria-labelledby="upcoming-events-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="upcoming-events-heading"
            eyebrow="Coming up"
            title={
              filterName ? `Upcoming in ${filterName}.` : "Upcoming events."
            }
            lead="Soonest first. You do not book on this site — each listing tells you exactly who to call."
          />

          <EventList
            key={`upcoming-${sector ?? "all"}`}
            scope="upcoming"
            sector={sector}
            limit={24}
            emptyHeading={
              sector
                ? "Nothing scheduled in this sector yet"
                : "Nothing on the calendar just now"
            }
            emptyBody={
              sector
                ? "There is nothing coming up here at the moment. Look at everything we have on, or tell us what you are after and we will let you know first."
                : "We are putting the next set of dates together. Tell us which sector you are in and we will make sure you hear first."
            }
            emptyActionLabel={sector ? "See all events" : undefined}
            emptyActionTo={sector ? "/events" : undefined}
          />
        </div>
      </section>

      <section
        aria-labelledby="past-events-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="past-events-heading"
            eyebrow="Already run"
            title={filterName ? `Past ${filterName} events.` : "Past events."}
            lead="Most recent first — a record of what these rooms actually look like."
          />

          <EventList
            key={`past-${sector ?? "all"}`}
            scope="past"
            sector={sector}
            limit={24}
            emptyHeading={
              sector
                ? "No past events in this sector yet"
                : "No past events yet"
            }
            emptyBody={
              sector
                ? "We have not run anything in this sector so far. The archive fills up as events happen."
                : "Once the first events have run, they will be listed here with photographs from the day."
            }
            emptyActionLabel={sector ? "See all events" : null}
            emptyActionTo={sector ? "/events" : null}
          />
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
