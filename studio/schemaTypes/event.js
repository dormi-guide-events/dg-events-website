import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineArrayMember, defineField, defineType } from "sanity";
import { slugOptions, validateSlug } from "../lib/slug.js";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Event name",
      type: "string",
      description: "What this event is called on the poster and in conversation.",
      validation: (Rule) => Rule.required().error("Every event needs a name."),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "The last part of the page link, for example dgevents.com/events/career-path-conference. Press Generate to build it from the event name.",
      options: slugOptions("event"),
      // A slug is a URL. Whitespace or capitals here produce a page that no
      // link on the site can reach — see studio/lib/slug.js.
      validation: (Rule) => Rule.required().custom(validateSlug),
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "reference",
      to: [{ type: "sector" }],
      description: "Which of the four guides this event belongs to.",
      validation: (Rule) =>
        Rule.required().error("Choose the sector this event is for."),
    }),
    defineField({
      name: "startDate",
      title: "Starts",
      type: "datetime",
      description:
        "Date and time the event begins. The website decides on its own whether an event is upcoming or past by comparing this to today, so there is nothing else to switch over afterwards.",
      validation: (Rule) =>
        Rule.required().error("An event needs a start date and time."),
    }),
    defineField({
      name: "endDate",
      title: "Ends",
      type: "datetime",
      description:
        "Optional. Leave this empty for a session with no set finishing time.",
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = context.document?.startDate;
          if (!endDate || !startDate) return true;
          return (
            new Date(endDate) > new Date(startDate) ||
            "The finish time has to be after the start time."
          );
        }),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      description: "The building or place, for example Accra International Conference Centre.",
    }),
    defineField({
      name: "city",
      title: "City or town",
      type: "string",
      initialValue: "Accra",
      description: "Change this when an event runs outside Accra.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover photo",
      type: "image",
      description:
        "The main picture for this event, shown on cards and at the top of the event page. Landscape photos work best.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Photo description",
          type: "string",
          description:
            "Describe what is happening in the photo, for people using a screen reader and for anyone whose images fail to load. For example: students talking with a panellist between sessions.",
          validation: (Rule) =>
            Rule.required().error(
              "Every photo needs a description. Say what is happening in it.",
            ),
        }),
      ],
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 3,
      description:
        "One or two sentences, used on event cards and by Google. Keep it under 160 characters.",
      validation: (Rule) =>
        Rule.max(160).warning(
          "Over 160 characters will be cut short on cards and in search results.",
        ),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "array",
      description:
        "The main write-up on the event page. Use headings and lists to break up long text.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Sub-heading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bulleted list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
        }),
      ],
    }),
    defineField({
      name: "contactNote",
      title: "How to attend",
      type: "string",
      description:
        "People book by contacting you directly — there is no sign-up on the website. Tell them exactly what to do, for example: Call 053 259 2824 to reserve a seat.",
    }),
    defineField({
      name: "isFeatured",
      title: "Feature on the home page",
      type: "boolean",
      initialValue: false,
      description: "Turn this on to pin the event to the top of the home page.",
    }),
  ],
  orderings: [
    {
      title: "Date, soonest first",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
    {
      title: "Date, most recent first",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      startDate: "startDate",
      sector: "sector.title",
      media: "coverImage",
    },
    prepare({ title, startDate, sector, media }) {
      const date = startDate
        ? new Date(startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "No date set";

      return {
        title,
        subtitle: [date, sector].filter(Boolean).join("  ·  "),
        media,
      };
    },
  },
});
