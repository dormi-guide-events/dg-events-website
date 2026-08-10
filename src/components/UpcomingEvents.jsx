import { Link } from "react-router-dom";
import { SectionHeading } from "./SectionHeading.jsx";
import { EventList } from "./EventList.jsx";
import { secondaryButton } from "../lib/ui.js";

export function UpcomingEvents() {
  return (
    <section
      id="upcoming"
      aria-labelledby="upcoming-heading"
      className="scroll-mt-24 border-t border-purple-900/10 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          id="upcoming-heading"
          eyebrow="Coming up"
          title="The next rooms to be in."
          action={
            <Link to="/events" className={`${secondaryButton} shrink-0`}>
              All events
            </Link>
          }
        />

        <EventList
          limit={3}
          emptyHeading="Nothing on the calendar just now"
          emptyBody="We are putting the next set of dates together. Tell us which sector you are in and we will make sure you hear first."
        />
      </div>
    </section>
  );
}
