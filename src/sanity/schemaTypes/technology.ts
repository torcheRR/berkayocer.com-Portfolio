import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { slugifyTr, slugRule } from "./localized";

export const technology = defineType({
  name: "technology",
  title: "Teknoloji",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "technology" }),
    defineField({ name: "name", title: "Ad", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", slugify: slugifyTr },
      validation: (r) => r.required().custom(slugRule),
    }),
    defineField({
      name: "categories",
      title: "Kategoriler",
      description: "Özgeçmişte, seçili kategorilerden bu listede en üstte olanın altında gösterilir.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Dil", value: "dil" },
          { title: "Frontend", value: "frontend" },
          { title: "Backend", value: "backend" },
          { title: "Mobil", value: "mobil" },
          { title: "Veri", value: "veri" },
          { title: "Araç", value: "arac" },
        ],
      },
      validation: (r) => r.required().min(1).unique(),
    }),
    defineField({
      name: "color",
      title: "Renk",
      type: "string",
      description: "Çipteki nokta rengi, #rrggbb",
      validation: (r) => r.required().regex(/^#[0-9a-fA-F]{6}$/, { name: "hex renk" }),
    }),
    defineField({ name: "url", title: "Resmi site", type: "url", validation: (r) => r.uri({ scheme: ["https"] }) }),
    defineField({
      name: "inStack",
      title: "Teknoloji kartında ve özgeçmişte göster",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "name", subtitle: "categories" }, prepare: ({ title, subtitle }) => ({ title, subtitle: (subtitle ?? []).join(", ") }) },
});
