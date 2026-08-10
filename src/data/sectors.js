// Content source of truth for the four sectors (CLAUDE.md). Names, remits and
// the three event formats per sector are taken from there verbatim; the
// purpose and format explanations are written copy.
//
// The order is the point: student → graduate → worker → entrepreneur is a life
// progression, and the accent colours walk the logo's purple→pink gradient in
// that order. Tailwind classes are written out in full because the compiler
// scans for literal strings — never build these by interpolation.

export const sectors = [
  {
    step: "01",
    slug: "students",
    to: "/sectors/students",
    name: "Dormi Students Guide",
    remit: "Academic & talent discovery",
    blurb:
      "Still in school, weighing up where it all leads. Find the path that fits what you are already good at.",
    headline: "Choose a course knowing where it actually leads.",
    purpose:
      "School tells you what to study. It rarely tells you where any of it ends up. Dormi Students Guide closes that gap with events that put you in front of the work itself — the people doing it, the tools they use, and the routes that got them there.",
    formats: [
      {
        name: "Career Path Conferences",
        description:
          "Sit with people already doing the job — engineers, nurses, designers, tradespeople — and hear what the work is really like before you commit three years to a programme.",
      },
      {
        name: "Talent Showcases & Festivals",
        description:
          "A stage for what you are good at outside the classroom. Music, dance, spoken word, design — seen by people who work in those industries.",
      },
      {
        name: "Technical & Craft Expos",
        description:
          "Hands on the tools of the trade. Welding, tailoring, catering, coding — try the work before you choose the course.",
      },
    ],
    metaTitle: "Dormi Students Guide",
    metaDescription:
      "Career path conferences, talent showcases and technical expos from Dormi Students Guide — events that show Ghanaian students where their studies actually lead.",
    accentText: "text-purple-900",
    accentBg: "bg-purple-900",
    accentBorder: "border-purple-900",
    accentHoverBg: "group-hover:bg-purple-900",
    accentRule: "from-purple-900",
    coverFrom: "from-purple-900",
    coverTo: "to-purple-700",
    lgOffset: "lg:mt-24",
  },
  {
    step: "02",
    slug: "graduates",
    to: "/sectors/graduates",
    name: "Dormi Graduates Guide",
    remit: "Transition & employment",
    blurb:
      "Certificate in hand, next step unclear. We close the gap between finishing school and getting hired.",
    headline: "The gap between finishing and starting.",
    purpose:
      "The stretch between leaving school and starting work is where a great deal of potential quietly stalls. Dormi Graduates Guide is built for exactly that stretch — the applications, the first interviews, and the life admin nobody sat you down to explain.",
    formats: [
      {
        name: "Job Readiness & Placement Fairs",
        description:
          "Employers with live vacancies in one hall, with CV surgeries and mock interview rooms running alongside. You leave with applications in, not a bag of leaflets.",
      },
      {
        name: "Adulting & Life Planning Roundtables",
        description:
          "Rent, tax, savings, family expectations, and learning to say no. Small groups, frank conversation, nobody pretending they have it worked out.",
      },
      {
        name: "Personal Branding & Tech Bootcamps",
        description:
          "Build the profile that gets you shortlisted, and the practical digital skills that keep you in the room once you are.",
      },
    ],
    metaTitle: "Dormi Graduates Guide",
    metaDescription:
      "Placement fairs, life planning roundtables and branding bootcamps from Dormi Graduates Guide — closing the gap between finishing school and getting hired.",
    accentText: "text-purple-700",
    accentBg: "bg-purple-700",
    accentBorder: "border-purple-700",
    accentHoverBg: "group-hover:bg-purple-700",
    accentRule: "from-purple-700",
    coverFrom: "from-purple-700",
    coverTo: "to-purple-500",
    lgOffset: "lg:mt-16",
  },
  {
    step: "03",
    slug: "workers",
    to: "/sectors/workers",
    name: "Dormi Workers Guide",
    remit: "Wellness & advancement",
    blurb:
      "In the job and building a life around it. Look after your health, your money and your rights.",
    headline: "Getting the job is not the finish line.",
    purpose:
      "Landing the role is one thing; lasting in it is another. Dormi Workers Guide is for the years afterwards — protecting your health, your money and your rights while you build something that holds.",
    formats: [
      {
        name: "Financial Stability Masterclasses",
        description:
          "Real numbers rather than principles. Budgeting on an irregular income, building a buffer, clearing debt, and how the pension scheme actually pays out.",
      },
      {
        name: "Workplace Wellness Retreats",
        description:
          "Time away from the desk to deal with what the job quietly costs you — sleep, stress, and the habit of working straight through it.",
      },
      {
        name: "Labour Rights Forums",
        description:
          "What your contract actually entitles you to, what to do when it is ignored, and who to call. Led by people who know the law.",
      },
    ],
    metaTitle: "Dormi Workers Guide",
    metaDescription:
      "Financial masterclasses, wellness retreats and labour rights forums from Dormi Workers Guide — protecting your health, your money and your rights at work.",
    accentText: "text-purple-500",
    accentBg: "bg-purple-500",
    accentBorder: "border-purple-500",
    accentHoverBg: "group-hover:bg-purple-500",
    accentRule: "from-purple-500",
    coverFrom: "from-purple-500",
    coverTo: "to-pink-500",
    lgOffset: "lg:mt-8",
  },
  {
    step: "04",
    slug: "entrepreneurs",
    to: "/sectors/entrepreneurs",
    name: "Dormi Entrepreneur Guide",
    remit: "Business acceleration",
    blurb:
      "Building something of your own. Get it funded, get it structured, and get it ready to scale.",
    headline: "Starting is the easy part.",
    purpose:
      "Starting something in Ghana is the easy part; keeping it alive is the work. Dormi Entrepreneur Guide brings founders together with funders, operators and one another — to get businesses funded, structured and ready to scale.",
    formats: [
      {
        name: "Pitch Competitions & Investor Mixers",
        description:
          "Six minutes in front of people who actually write cheques, live feedback from the panel, and structured introductions once the pitching is done.",
      },
      {
        name: "Business Model & Scaling Intensives",
        description:
          "Working sessions on the unglamorous parts — pricing, margins, supply, and the systems that let a business grow without breaking.",
      },
      {
        name: "Leadership & Team Management Summits",
        description:
          "Hiring your first staff, paying them properly, and learning to lead a team rather than quietly do everything yourself.",
      },
    ],
    metaTitle: "Dormi Entrepreneur Guide",
    metaDescription:
      "Pitch nights, scaling intensives and leadership summits from Dormi Entrepreneur Guide — helping Ghanaian founders get funded, structured and ready to scale.",
    accentText: "text-pink-500",
    accentBg: "bg-pink-500",
    accentBorder: "border-pink-500",
    accentHoverBg: "group-hover:bg-pink-500",
    accentRule: "from-pink-500",
    coverFrom: "from-pink-500",
    coverTo: "to-pink-400",
    lgOffset: "lg:mt-0",
  },
];
