import { TagIcon } from "@sanity/icons/Tag";
import { defineArrayMember, defineField, defineType } from "sanity";

export const sector = defineType({
  name: "sector",
  title: "Sector",
  type: "document",
  icon: TagIcon,
  description: "The four guides. These rarely change.",
  fields: [
    defineField({
      name: "title",
      title: "Sector name",
      type: "string",
      description: "For example: Dormi Students Guide.",
      validation: (Rule) => Rule.required().error("A sector needs a name."),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "The last part of the page link, for example dgevents.com/sectors/students. Press Generate, then shorten it to a single word if you can.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) =>
        Rule.required().error("Press Generate to create the web address."),
    }),
    defineField({
      name: "remit",
      title: "Short label",
      type: "string",
      description:
        "Two or three words summing the sector up, shown on event cards and at the top of the sector page. For example: Academic & talent discovery.",
      validation: (Rule) =>
        Rule.required()
          .error("Give this sector a short label.")
          .max(40)
          .warning("Longer than about 40 characters will crowd the event cards."),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      description:
        "One or two sentences explaining who this sector is for, in their words rather than ours.",
      validation: (Rule) =>
        Rule.required().error("Say who this sector is for."),
    }),
    defineField({
      name: "displayOrder",
      title: "Order on the website",
      type: "number",
      description:
        "The four sectors are shown as a journey — student, then graduate, then worker, then entrepreneur. Number them 1 to 4 to set that order.",
      validation: (Rule) =>
        Rule.required()
          .integer()
          .min(1)
          .error("Give each sector a number from 1 upwards."),
    }),
    defineField({
      name: "eventFormats",
      title: "Event formats",
      type: "array",
      description:
        "The three kinds of event this sector runs, with a line explaining each one.",
      of: [
        defineArrayMember({
          type: "object",
          name: "eventFormat",
          title: "Event format",
          fields: [
            defineField({
              name: "name",
              title: "Format name",
              type: "string",
              description: "For example: Career Path Conferences.",
              validation: (Rule) =>
                Rule.required().error("Give this format a name."),
            }),
            defineField({
              name: "description",
              title: "What happens",
              type: "text",
              rows: 3,
              description:
                "A sentence or two on what someone actually gets out of attending.",
              validation: (Rule) =>
                Rule.required().error("Explain what this format involves."),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "description" },
          },
        }),
      ],
      // Every sector runs three formats today, but that is a description of
      // the current content rather than a rule — locking it at three would
      // stop a half-drafted sector saving, or a fourth format being added.
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(6)
          .error("A sector needs between one and six event formats."),
    }),
  ],
  orderings: [
    {
      title: "Journey order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "remit", order: "displayOrder" },
    prepare({ title, subtitle, order }) {
      return {
        title: order ? `${order}. ${title}` : title,
        subtitle,
      };
    },
  },
});
