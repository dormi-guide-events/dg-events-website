import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      validation: (Rule) => Rule.required().error("A team member needs a name."),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Their job title, for example: Events Director.",
      validation: (Rule) => Rule.required().error("Give this person a role."),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      description:
        "A head-and-shoulders photo. Square or portrait works best; use the crop tool to keep the face centred.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Photo description",
          type: "string",
          description:
            "Describe the photo for people using a screen reader, for example: Ama Boateng, Events Director, smiling to camera.",
          validation: (Rule) =>
            Rule.required().error("Every photo needs a description."),
        }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "text",
      rows: 4,
      description:
        "Two or three sentences on who they are and what they do here. Keep it warm and plain — this is not a CV.",
    }),
    defineField({
      name: "displayOrder",
      title: "Order on the page",
      type: "number",
      description:
        "Lower numbers appear first. Number people 1, 2, 3 and so on to control the order they are listed in.",
      validation: (Rule) =>
        Rule.integer().min(1).error("Use a whole number from 1 upwards."),
    }),
  ],
  orderings: [
    {
      title: "Page order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
    {
      title: "Name, A to Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      role: "role",
      order: "displayOrder",
      media: "photo",
    },
    prepare({ title, role, order, media }) {
      return {
        title: order ? `${order}. ${title}` : title,
        subtitle: role,
        media,
      };
    },
  },
});
