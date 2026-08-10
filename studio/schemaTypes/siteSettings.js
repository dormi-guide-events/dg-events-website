import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton. There is only ever one of these, so the Studio opens it directly
 * from the sidebar and the "create" and "delete" actions are removed in
 * sanity.config.js.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "contact", title: "Contact details", default: true },
    { name: "social", title: "Social links" },
  ],
  fields: [
    defineField({
      name: "contactEmail",
      title: "Email address",
      type: "string",
      group: "contact",
      description: "The address shown in the footer and on the contact page.",
      validation: (Rule) =>
        Rule.required()
          .email()
          .error("Enter a valid email address, for example hello@example.com."),
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      group: "contact",
      description:
        "Write it the way you would say it, for example +233 (0) 53 259 2824. The website turns it into a tappable link on its own.",
      validation: (Rule) => Rule.required().error("A phone number is needed."),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      group: "contact",
      description: "Where you are based. One line per line of the address.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "social",
      description:
        "Add one for each account you actually use. Anything left off here simply will not appear on the website.",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          title: "Social link",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "X (Twitter)", value: "x" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "YouTube", value: "youtube" },
                  { title: "WhatsApp", value: "whatsapp" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required().error("Pick a platform."),
            }),
            defineField({
              name: "url",
              title: "Link",
              type: "url",
              description: "Paste the full web address of your profile.",
              validation: (Rule) =>
                Rule.required()
                  .uri({ scheme: ["http", "https"] })
                  .error("Paste the full link, starting with https://"),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.unique().error("That platform is already in the list."),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});
