import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { FeatureGrid } from "../components/FeatureGrid.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { ClosingCta } from "../components/ClosingCta.jsx";
import { secondaryButton } from "../lib/ui.js";

// The four core pillars, named as CLAUDE.md names them. The home page frames
// the same four as benefits; here they get their proper titles.
const pillars = [
  {
    title: "Youth participation",
    body: "Young people shape the programme rather than simply attend it. Every agenda starts from what people at that stage told us they were up against.",
  },
  {
    title: "Entrepreneurship",
    body: "Ghana's young people are already building things. We back that with rooms where they can find funding, structure and honest counsel.",
  },
  {
    title: "Quality education",
    body: "Learning that holds up outside the hall — taught by people currently doing the work rather than reciting it.",
  },
  {
    title: "Leadership",
    body: "Practice at leading before the title arrives, because leadership is a habit long before it is a promotion.",
  },
];

// TODO: CLAUDE.md names "core objectives" as an About-page section but never
// enumerates them — the only enumerated set in the file is the four pillars
// above. These three are drafted from what the organisation actually does and
// need the client's sign-off before launch.
const objectives = [
  {
    title: "Close the gaps between stages",
    body: "School to university, graduation to work, employment to enterprise. Every transition is a place where potential quietly leaks away, so we put an event at each one.",
  },
  {
    title: "Put young people in front of the people who decide",
    body: "Employers, investors, regulators, practitioners. Access is the scarcest thing on offer, so we make it the whole point of the room rather than a happy accident.",
  },
  {
    title: "Send everyone home with something to act on",
    body: "Every event ends with a step you can take that week — an application, an introduction, a number to call. Not a certificate for the wall.",
  },
];

// The three core event approaches.
const approaches = [
  {
    title: "Workshops and training",
    body: "Small, practical and hands-on. You come to work rather than to watch, and you leave having actually done the thing.",
  },
  {
    title: "Networking mixers",
    body: "Introductions with a purpose and a structure, so nobody spends the whole evening talking to the person they arrived with.",
  },
  {
    title: "Mentorship assemblies",
    body: "Guidance that continues after the room empties, pairing people at one stage with people a few steps further along.",
  },
];

export function About() {
  return (
    <>
      <PageMeta
        title="About"
        description="Dormi Guide Events is a Ghanaian event-led organisation founded in 2026, running targeted events for students, graduates, workers and entrepreneurs."
      />

      <PageHeader
        eyebrow="About Dormi Guide Events"
        title="An organisation built around one belief."
        lead="That young Ghanaians are not short of potential. They are short of rooms where it gets noticed, tested and backed."
      />

      <section
        aria-labelledby="story-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="story-heading"
            eyebrow="Who we are"
            title="Founded in 2026, with a deliberately narrow remit."
          />

          <Reveal className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-grey-500">
            <p>
              Dormi Guide Events is an event-led organisation working across
              Ghana. We exist to unlock potential in young people through
              events built for a specific moment in their lives — not
              conferences for their own sake, and not one programme stretched
              to fit everybody.
            </p>
            <p>
              That is why the work is organised into four sectors rather than
              one audience. A student choosing a course and a founder hiring
              their first staff need very different rooms, and pretending
              otherwise serves neither of them.
            </p>
            <p>
              We do not run memberships and we do not keep an attendee
              database. We run events, we make sure the right people are in
              them, and we point everyone at the next thing they can do.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="pillars-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="pillars-heading"
            eyebrow="Core pillars"
            title="Four things every event has to carry."
            lead="Whichever sector a programme belongs to, it is measured against these."
          />
          <FeatureGrid items={pillars} columns={4} />
        </div>
      </section>

      <section
        aria-labelledby="objectives-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="objectives-heading"
            eyebrow="Core objectives"
            title="What we are actually trying to achieve."
          />
          <FeatureGrid items={objectives} columns={3} numbered />
        </div>
      </section>

      <section
        aria-labelledby="approaches-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="approaches-heading"
            eyebrow="How we run events"
            title="Three formats, used deliberately."
            lead="Most programmes combine all three across a day. Which one leads depends on what the room is for."
          />
          <FeatureGrid items={approaches} columns={3} />
        </div>
      </section>

      {/* PLACEHOLDER — the client has not supplied team names, roles, photos or
          bios yet. Replace this whole block with the real team grid; the
          dashed treatment marks it as unfinished on purpose. */}
      <section
        aria-labelledby="team-heading"
        className="border-t border-purple-900/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            id="team-heading"
            eyebrow="The team"
            title="The people behind the programme."
          />

          <Reveal>
            <div className="mt-12 rounded-2xl border border-dashed border-purple-900/20 bg-pink-100/50 px-6 py-14 text-center">
              <span
                aria-hidden="true"
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-700 to-pink-500"
              >
                <span className="h-5 w-5 rounded-full bg-off-white" />
              </span>
              <h3 className="mt-5 font-serif text-xl text-purple-900">
                Team profiles are on the way
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-grey-500">
                We are putting together proper introductions to the people who
                plan, host and run these events. In the meantime, if you want
                to speak to someone, speak to us directly.
              </p>
              <Link
                to="/contact"
                className={`${secondaryButton} mt-7 border-purple-900/20 bg-off-white`}
              >
                Get in touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
