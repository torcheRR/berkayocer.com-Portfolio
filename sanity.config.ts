"use client";

// berkayocer.com/studio adresindeki gömülü Sanity Studio.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/env";
import { locations, mainDocuments } from "./src/sanity/presentation";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "berkayocer",
  title: "berkayocer.com",
  basePath: studioUrl,
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
  // Studio, Önizleme (site yan yanayken düzenleme) ile açılır; belge listeleri ikinci sekmede.
  plugins: [
    presentationTool({
      title: "Önizleme",
      // Önizleme modu yalnızca /api/draft-mode/enable üzerinden açılır (Viewer token'la doğrulanan anahtar).
      // Düz bir string verilirse önizleme modu devre dışı kalır; nesne biçimi bilinçli.
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable", shareAccess: false } },
      resolve: { mainDocuments, locations },
    }),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
