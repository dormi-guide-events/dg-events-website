// @sanity/icons v5 removed named icon exports from the package root — they
// remain only as deprecation stubs typed `never`, so a root import silently
// resolves to undefined. Each icon has to come from its own subpath.
import { CalendarIcon } from "@sanity/icons/Calendar";
import { CogIcon } from "@sanity/icons/Cog";
import { ImagesIcon } from "@sanity/icons/Images";
import { TagIcon } from "@sanity/icons/Tag";
import { UsersIcon } from "@sanity/icons/Users";

/**
 * Sidebar order, arranged by how often an editor actually touches each one:
 * Events and Gallery change constantly, Team occasionally, Sectors almost
 * never, and Site settings is a single document rather than a list.
 */
export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("event").title("Events").icon(CalendarIcon),
      S.documentTypeListItem("galleryImage").title("Gallery").icon(ImagesIcon),
      S.documentTypeListItem("teamMember").title("Team").icon(UsersIcon),
      S.documentTypeListItem("sector").title("Sectors").icon(TagIcon),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
    ]);
