import { SectionHeading } from "./SectionHeading.jsx";
import { FeatureGrid } from "./FeatureGrid.jsx";

// The four core pillars from CLAUDE.md — youth participation, entrepreneurship,
// quality education and leadership — written here as what a visitor actually
// gets. The About page names them plainly instead.
const pillars = [
  {
    title: "A seat at the table",
    body: "Young people help shape the programme, not just fill the seats. What gets discussed comes from what you told us matters.",
  },
  {
    title: "Learning you can use on Monday",
    body: "Sessions run by people doing the work right now, so you leave with something you can put to use this week.",
  },
  {
    title: "From idea to income",
    body: "Pitch rooms, investor mixers and straight talk about structure and scale — the unglamorous parts that decide whether a business lasts.",
  },
  {
    title: "People worth following",
    body: "Room to practise leading teams and projects before the title arrives, alongside people doing exactly the same.",
  },
];

export function Objectives() {
  return (
    <section
      aria-labelledby="objectives-heading"
      className="border-t border-purple-900/10 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          id="objectives-heading"
          eyebrow="What we are here to do"
          title="Four commitments, whichever sector you are in."
        />
        <FeatureGrid items={pillars} columns={4} />
      </div>
    </section>
  );
}
