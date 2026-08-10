import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { dataset, projectId } from "./env.js";
import { schemaTypes } from "./schemaTypes/index.js";
import { structure } from "./structure.js";

// Site settings is a singleton: exactly one document, with a fixed id.
const SINGLETONS = ["siteSettings"];

export default defineConfig({
  name: "default",
  title: "DG Events",

  projectId,
  dataset,

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    // Keep singletons out of the global "create new" menu — the only way in is
    // the sidebar entry, which always opens the same document.
    templates: (prev) =>
      prev.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    // A singleton cannot be duplicated, deleted or unpublished.
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(
            ({ action }) =>
              !["duplicate", "delete", "unpublish"].includes(action),
          )
        : prev,
  },
});
