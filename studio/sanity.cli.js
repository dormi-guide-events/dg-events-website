import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./env.js";

export default defineCliConfig({
  api: { projectId, dataset },
});
