// Placeholder events shaped exactly like the Sanity `event` document (CLAUDE.md).
// This file disappears once the CMS is wired up — nothing should import it
// directly except src/lib/events.js, which is the seam Sanity will replace.
//
// `sector` stands in for the resolved sector reference and carries the slug.
// `description` is portable text, so it stays an array of blocks rather than a
// string — a reminder that it must never be dropped into innerHTML.
// `coverImage.url` is null until real photography exists; the alt text records
// what each picture should show so it is written before the image arrives.

export const events = [
  {
    title: "Career Path Conference 2026",
    slug: "career-path-conference-2026",
    sector: "students",
    startDate: "2026-09-19T09:00:00+00:00",
    endDate: "2026-09-19T16:00:00+00:00",
    venue: "Accra International Conference Centre",
    city: "Accra",
    coverImage: {
      url: null,
      alt: "Senior secondary students in conversation with a panellist between sessions",
    },
    summary:
      "A full day of honest conversations with people already doing the work, so you can choose a course knowing where it actually leads.",
    description: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Choosing a programme at eighteen is a decision made with very little information. This conference closes that gap: engineers, nurses, designers, accountants and tradespeople talk through what their days really look like, what they earn, and what they would choose again.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The afternoon runs as small-group clinics, so every student leaves with two or three concrete next steps rather than a tote bag.",
          },
        ],
      },
    ],
    contactNote: "Call 053 259 2824 to reserve a seat. Entry is free for students in uniform.",
    isFeatured: true,
  },
  {
    title: "Pitch Night: Founders & Funders",
    slug: "pitch-night-founders-and-funders",
    sector: "entrepreneurs",
    startDate: "2026-11-07T17:30:00+00:00",
    endDate: "2026-11-07T21:00:00+00:00",
    venue: "Impact Hub Accra",
    city: "Accra",
    coverImage: {
      url: null,
      alt: "A founder mid-pitch on a small stage while investors take notes",
    },
    summary:
      "Eight founders, six minutes each, in a room with people who actually write cheques. Structured mixing afterwards, not polite milling about.",
    description: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Pitch Night pairs early-stage Ghanaian founders with angel investors and fund managers working in the market. Every pitch gets live feedback from the panel, and every founder leaves with written notes.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Applications to pitch close a fortnight before the event. Attending as an audience member stays open until the room is full.",
          },
        ],
      },
    ],
    contactNote: "Call 053 259 2824 to apply to pitch or to reserve a place in the audience.",
    isFeatured: false,
  },
  {
    title: "Job Readiness & Placement Fair",
    slug: "job-readiness-and-placement-fair",
    sector: "graduates",
    startDate: "2026-05-16T08:30:00+00:00",
    endDate: "2026-05-16T15:00:00+00:00",
    venue: "University of Ghana Business School",
    city: "Legon",
    coverImage: {
      url: null,
      alt: "Recent graduates queuing at employer stands with folders of CVs",
    },
    summary:
      "Thirty employers hiring now, plus CV surgeries and mock interviews running all day. Two hundred graduates left with an interview booked.",
    description: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Our largest placement fair to date brought thirty employers with live vacancies into one hall alongside CV surgeries, mock interview rooms and a clinic on negotiating a first salary.",
          },
        ],
      },
    ],
    contactNote: "This event has passed. Call 053 259 2824 to hear about the next placement fair.",
    isFeatured: false,
  },
  {
    title: "Financial Stability Masterclass",
    slug: "financial-stability-masterclass",
    sector: "workers",
    startDate: "2026-02-21T10:00:00+00:00",
    endDate: null,
    venue: "Kempinski Hotel Gold Coast City",
    city: "Accra",
    coverImage: {
      url: null,
      alt: "Attendees working through a budgeting exercise at a seminar table",
    },
    summary:
      "A working Saturday on the things nobody teaches you: budgeting on an irregular income, pensions, and getting out of debt for good.",
    description: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Led by practising financial advisers, this masterclass worked through real numbers rather than principles: what to do with a first salary, how to build a buffer on an irregular income, and how the national pension scheme actually pays out.",
          },
        ],
      },
    ],
    contactNote: "This event has passed. Call 053 259 2824 to join the waiting list for the next one.",
    isFeatured: false,
  },
];
