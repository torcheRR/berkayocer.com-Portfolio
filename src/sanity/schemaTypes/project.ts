import { defineArrayMember, defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { hexColor, slugifyTr, slugRule } from "./localized";

export const project = defineType({
  name: "project",
  title: "Proje",
  type: "document",
  orderings: [orderRankOrdering],
  groups: [
    { name: "temel", title: "Temel", default: true },
    { name: "gorsel", title: "Görsel" },
    { name: "vaka", title: "Case study" },
  ],
  fields: [
    orderRankField({ type: "project" }),
    defineField({ name: "title", title: "Başlık", type: "string", group: "temel", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "temel",
      description: "Proje sayfasının adresi: /projeler/<slug>",
      options: { source: "title", slugify: slugifyTr },
      validation: (r) => r.required().custom(slugRule),
    }),
    defineField({ name: "summary", title: "Kısa özet", type: "localeText", group: "temel", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Açıklama", type: "localeText", group: "temel" }),
    defineField({
      name: "year",
      title: "Yıl",
      type: "number",
      group: "temel",
      validation: (r) => r.required().integer().min(2015).max(2100),
    }),
    defineField({
      name: "kind",
      title: "Tür",
      type: "string",
      group: "temel",
      options: {
        list: [
          { title: "Bitirme projesi", value: "bitirme" },
          { title: "Staj", value: "staj" },
          { title: "Kişisel", value: "kisisel" },
          { title: "Okul", value: "okul" },
          { title: "Öğrenme", value: "ogrenme" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Durum",
      type: "string",
      group: "temel",
      options: { list: [{ title: "Aktif", value: "aktif" }, { title: "Tamamlandı", value: "tamamlandi" }], layout: "radio" },
      initialValue: "tamamlandi",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Ana sayfada öne çıkar",
      description: "Öne çıkanlar 'Projeler' listesindeki sürükle-bırak sırasına göre gösterilir.",
      type: "boolean",
      group: "temel",
      initialValue: false,
    }),
    defineField({
      name: "tech",
      title: "Teknolojiler",
      type: "array",
      group: "temel",
      of: [defineArrayMember({ type: "reference", to: [{ type: "technology" }] })],
      validation: (r) => r.required().min(1).unique(),
    }),
    defineField({
      name: "links",
      title: "Bağlantılar",
      type: "object",
      group: "temel",
      fields: [
        defineField({ name: "repo", title: "GitHub", type: "url", validation: (r) => r.uri({ scheme: ["https"] }) }),
        defineField({ name: "demo", title: "Canlı demo", type: "url", validation: (r) => r.uri({ scheme: ["https"] }) }),
      ],
    }),
    defineField({
      name: "cover",
      title: "Kapak",
      type: "object",
      group: "gorsel",
      description: "Görsel yoksa kısaltma ve renkle bir kapak üretilir.",
      fields: [
        defineField({
          name: "mark",
          title: "Kısaltma",
          type: "string",
          description: "En fazla 4 karakter, ör. TW",
          validation: (r) => r.required().max(4),
        }),
        hexColor("Marka rengi"),
        defineField({
          name: "image",
          title: "Kapak görseli",
          type: "image",
          description: "16:9 önerilir. Odak noktasını (hotspot) ayarlayabilirsin.",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alternatif metin", type: "string", validation: (r) => r.required() })],
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Case study",
      type: "array",
      group: "vaka",
      description: "Problem, yaklaşım, sonuç. Bir ifadeyi seçip 'Vurgula' ile sarı kalemle işaretleyebilirsin.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraf", value: "normal" },
            { title: "Başlık", value: "h2" },
            { title: "Alt başlık", value: "h3" },
            { title: "Alıntı", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Kalın", value: "strong" },
              { title: "İtalik", value: "em" },
              { title: "Kod", value: "code" },
              { title: "Vurgula", value: "highlight" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Bağlantı",
                fields: [{ name: "href", type: "url", title: "Adres", validation: (r) => r.uri({ scheme: ["https", "mailto"] }) }],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alternatif metin", type: "string", validation: (r) => r.required() }),
            defineField({ name: "caption", title: "Açıklama (Fig. etiketi)", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", year: "year", kind: "kind", featured: "featured", media: "cover.image" },
    prepare: ({ title, year, kind, featured, media }) => ({
      title: `${featured ? "★ " : ""}${title}`,
      subtitle: [year, kind].filter(Boolean).join(" · "),
      media,
    }),
  },
});
