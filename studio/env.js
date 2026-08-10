// Sanity project ids and dataset names are public identifiers, not secrets, so
// they are safe to commit. They are read from the environment first so a
// different project (a staging dataset, say) can be swapped in without edits.

export const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || "i2k116ix";

export const dataset = process.env.SANITY_STUDIO_DATASET || "production";
