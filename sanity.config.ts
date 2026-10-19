"use client";

// berkayocer.com/studio adresindeki gömülü Sanity Studio.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "berkayocer",
  title: "berkayocer.com",
  basePath: "/studio",
  // Proje kimliği yoksa Studio sayfası açıklama gösterir; bu değer yalnızca config'in geçerli kalması için.
  projectId: projectId || "unset",
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType) ? actions.filter(({ action }) => action && !["delete", "duplicate", "unpublish"].includes(action)) : actions,
    newDocumentOptions: (prev) => prev.filter((item) => !singletonTypes.has(item.templateId)),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
