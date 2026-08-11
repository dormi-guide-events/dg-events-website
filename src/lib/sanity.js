import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-01-01";

// Fail loudly at startup rather than with a confusing 404 on the first query.
if (!projectId || !dataset) {
  throw new Error(
    "Sanity is not configured. Copy .env.example to .env and fill in " +
      "VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET.",
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Public dataset, so reads come from the cached edge CDN: faster and cheaper,
  // which matters on Ghanaian mobile connections.
  useCdn: true,
  // Published documents only. There is deliberately no token — the frontend
  // reads and nothing else, so drafts are unreachable by construction.
  perspective: "published",
});

const builder = imageUrlBuilder(client);

/** Start a Sanity image URL. Chain .width(), .auto('format') and so on. */
export function urlFor(source) {
  return builder.image(source);
}
