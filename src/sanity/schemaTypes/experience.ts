import { defineField, defineType } from "sanity";

const month = /^\d{4}-(0[1-9]|1[0-2])$/;

export const experience = defineType({
  name: "experience",
  title: "Deneyim",
  type: "document",
  orderings: [{ title: "Başlangıç (yeniden eskiye)", name: "startDesc", by: [{ field: "start", direction: "desc" }] }],
  fields: [
    defineField({ name: "company", title: "Şirket", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Rol", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Tür",
      type: "string",
      options: {
        list: [
          { title: "Tam zamanlı", value: "tam-zamanli" },
          { title: "Staj", value: "staj" },
          { title: "Gönüllü", value: "gonullu" },
          { title: "Freelance", value: "freelance" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "start",
      title: "Başlangıç",
      type: "string",
      description: "YYYY-AA, ör. 2025-07",
      validation: (r) => r.required().regex(month, { name: "YYYY-AA" }),
    }),
    defineField({
      name: "end",
      title: "Bitiş",
      type: "string",
      description: "YYYY-AA. Hâlâ devam ediyorsa boş bırak.",
      validation: (r) =>
        r.regex(month, { name: "YYYY-AA" }).custom((end, ctx) => {
          const start = (ctx.document as { start?: string } | undefined)?.start;
          return !end || !start || end >= start ? true : "Bitiş başlangıçtan önce olamaz";
        }),
    }),
    defineField({ name: "location", title: "Konum", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Ne yaptın?", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "tags", title: "Etiketler", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
  ],
  preview: {
    select: { company: "company", role: "role.tr", start: "start", end: "end" },
    prepare: ({ company, role, start, end }) => ({ title: `${company} · ${role ?? ""}`, subtitle: `${start ?? "?"} – ${end ?? "şimdi"}` }),
  },
});

export const education = defineType({
  name: "education",
  title: "Eğitim",
  type: "document",
  fields: [
    defineField({ name: "school", title: "Okul", type: "string", validation: (r) => r.required() }),
    defineField({ name: "degree", title: "Bölüm / derece", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "start", title: "Başlangıç yılı", type: "number", validation: (r) => r.required().integer() }),
    defineField({ name: "end", title: "Bitiş yılı", type: "number", description: "Devam ediyorsa boş bırak.", validation: (r) => r.integer() }),
    defineField({ name: "gpa", title: "AGNO", type: "string", description: "Boş bırakırsan gösterilmez." }),
    defineField({ name: "note", title: "Not", type: "localeString", description: "ör. Bitirme projesi: TravelWise" }),
  ],
  preview: { select: { title: "school", start: "start", end: "end" }, prepare: ({ title, start, end }) => ({ title, subtitle: `${start} – ${end ?? "devam ediyor"}` }) },
});
