import { defineField, defineType } from "sanity";

// Alan bazlı çeviri: Türkçe zorunlu, İngilizce şimdilik opsiyonel ve kapalı bir bölümde.
// Site bugün yalnızca "tr" okur; EN eklendiğinde içerik katmanı dili seçecek.
const fieldsets = [{ name: "en", title: "English (opsiyonel)", options: { collapsible: true, collapsed: true } }];

export const localeString = defineType({
  name: "localeString",
  title: "Metin",
  type: "object",
  fieldsets,
  fields: [
    defineField({ name: "tr", title: "Türkçe", type: "string", validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "string", fieldset: "en" }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Uzun metin",
  type: "object",
  fieldsets,
  fields: [
    defineField({ name: "tr", title: "Türkçe", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "text", rows: 3, fieldset: "en" }),
  ],
});

// Türkçe karakterleri sadeleştiren slug üretici (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u).
export function slugifyTr(input: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", i̇: "i", ö: "o", ş: "s", ü: "u" };
  return input
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]|i̇/g, (c) => map[c] ?? c)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 96)
    .replace(/^-+|-+$/g, "");
}

// Sitenin içerik şemasıyla aynı kural: elle yazılan slug da küçük harf, rakam ve tire olmalı.
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const slugRule = (value?: { current?: string }) =>
  !value?.current || SLUG_RE.test(value.current) || "Yalnızca küçük harf, rakam ve tire kullan (ör. travelwise-app). 'Generate' düğmesi doğru biçimi üretir.";

// Geçersiz saat dilimi sitedeki saat bileşenlerini çökertir.
export const timeZoneRule = (tz?: string) => {
  if (!tz) return true;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return "Geçerli bir IANA saat dilimi gir (ör. Europe/Istanbul).";
  }
};

export const hexColor = (label = "Renk") =>
  defineField({
    name: "brand",
    title: label,
    type: "string",
    description: "#rrggbb biçiminde, ör. #2dd4bf",
    validation: (r) => r.required().regex(/^#[0-9a-fA-F]{6}$/, { name: "hex renk" }),
  });
