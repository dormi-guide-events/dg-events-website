import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery photo",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Use the crop tool to choose the part of the photo that must always stay in view.",
      fields: [
        defineField({
          name: "alt",
          title: "Photo description",
          type: "string",
          description:
            "Describe what is happening, for people using a screen reader. For example: three students presenting a project at the craft expo.",
          validation: (Rule) =>
            Rule.required().error(
              "Every photo needs a description. Say what is happening in it.",
            ),
        }),
      ],
      validation: (Rule) => Rule.required().error("Choose a photo to upload."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description:
        "Optional. Shown under the photo in the gallery. Leave empty if the photo speaks for itself.",
    }),
    defineField({
      name: "event",
      title: "Taken at",
      type: "reference",
      to: [{ type: "event" }],
      description:
        "Optional. Link this photo to the event it came from, so it can also appear on that event's page.",
    }),
    defineField({
      name: "date",
      title: "Date taken",
      type: "date",
      options: { dateFormat: "D MMMM YYYY" },
      description: "Used to sort the gallery, newest first.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      caption: "caption",
      alt: "image.alt",
      eventTitle: "event.title",
      date: "date",
      media: "image",
    },
    prepare({ caption, alt, eventTitle, date, media }) {
      const when = date
        ? new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : null;

      return {
        title: caption || alt || "Untitled photo",
        subtitle: [eventTitle, when].filter(Boolean).join("  ·  "),
        media,
      };
    },
  },
});
