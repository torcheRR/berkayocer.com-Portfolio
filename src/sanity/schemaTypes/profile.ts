import { defineArrayMember, defineField, defineType } from "sanity";
import { timeZoneRule } from "./localized";

// Tekil belge (singleton): sitenin kimlik bilgileri, hero, durum hücreleri ve iletişim.
export const profile = defineType({
  name: "profile",
  title: "Profil",
  type: "document",
  groups: [
    { name: "kimlik", title: "Kimlik", default: true },
    { name: "durum", title: "Durum ve çalışma biçimi" },
    { name: "iletisim", title: "İletişim" },
  ],
  fields: [
    defineField({ name: "name", title: "Ad soyad", type: "string", group: "kimlik", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Unvan", type: "string", group: "kimlik", description: "ör. Software Engineer", validation: (r) => r.required() }),
    defineField({
      name: "tagline",
      title: "Hero cümlesi",
      type: "localeString",
      group: "kimlik",
      description: "Sarı kalemle vurgulanacak kısmı ==iki eşittir== arasına yaz.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "bio", title: "Özet (özgeçmiş)", type: "localeText", group: "kimlik", validation: (r) => r.required() }),
    defineField({
      name: "portrait",
      title: "Portre",
      type: "image",
      group: "kimlik",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternatif metin", type: "string", validation: (r) => r.required() })],
    }),
    defineField({ name: "location", title: "Konum", type: "localeString", group: "kimlik", validation: (r) => r.required() }),
    defineField({
      name: "timeZone",
      title: "Saat dilimi",
      type: "string",
      group: "kimlik",
      description: "IANA adı, ör. Europe/Istanbul",
      initialValue: "Europe/Istanbul",
      validation: (r) => r.required().custom(timeZoneRule),
    }),
    defineField({
      name: "status",
      title: "Durum hücreleri",
      type: "array",
      group: "durum",
      description: "Hero'nun altındaki en fazla 3 hücre (dördüncüsü her zaman İletişim).",
      of: [
        defineArrayMember({
          type: "object",
          name: "statusCell",
          fields: [
            defineField({ name: "label", title: "Etiket", type: "localeString", description: "ör. ŞU AN", validation: (r) => r.required() }),
            defineField({ name: "title", title: "Başlık", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "detail", title: "Detay", type: "localeString", validation: (r) => r.required() }),
            defineField({
              name: "tone",
              title: "Nokta rengi",
              type: "string",
              options: { list: ["mark", "ok", "info", "muted"], layout: "radio" },
              initialValue: "muted",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "label.tr", subtitle: "title.tr" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "workflow",
      title: "Çalışma biçimi",
      type: "object",
      group: "durum",
      fields: [
        defineField({ name: "text", title: "Metin", type: "localeText", validation: (r) => r.required() }),
        defineField({
          name: "steps",
          title: "Adımlar",
          type: "array",
          of: [{ type: "string" }],
          validation: (r) => r.required().min(2).max(5),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: "email", title: "E-posta", type: "string", group: "iletisim", validation: (r) => r.required().email() }),
    defineField({ name: "availability", title: "Çalışma durumu", type: "localeString", group: "iletisim", validation: (r) => r.required() }),
    defineField({ name: "githubUser", title: "GitHub kullanıcı adı", type: "string", group: "iletisim", validation: (r) => r.required() }),
    defineField({
      name: "showGithubActivity",
      title: "GitHub katkı takvimini göster",
      type: "boolean",
      group: "iletisim",
      initialValue: true,
    }),
    defineField({
      name: "socials",
      title: "Sosyal medya",
      type: "array",
      group: "iletisim",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: { list: ["linkedin", "github", "x", "instagram"] },
              validation: (r) => r.required(),
            }),
            defineField({ name: "label", title: "Etiket", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", title: "Adres", type: "url", validation: (r) => r.required().uri({ scheme: ["https"] }) }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: "Profil" }) },
});
