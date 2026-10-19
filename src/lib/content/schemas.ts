import { z } from "zod";

// İçerik şemaları: yerel seed verisi bugün, Sanity adapter'ı yarın aynı şemalardan geçer.
// Metin alanları şimdilik tek dilli (TR); EN eklendiğinde repository katmanı locale çözecek.

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug küçük harf, rakam ve tire içermeli");
const hex = z.string().regex(/^#[0-9a-f]{6}$/i, "renk #rrggbb biçiminde olmalı");
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "tarih YYYY-AA biçiminde olmalı");
const url = z.url({ protocol: /^https$/ });

export const techCategories = ["dil", "frontend", "backend", "mobil", "veri", "arac"] as const;
export const TechCategory = z.enum(techCategories);

export const Technology = z.object({
  slug,
  name: z.string().min(1),
  categories: z.array(TechCategory).min(1),
  color: hex,
  url: url.optional(),
  inStack: z.boolean().default(false),
});

// Görseller kaynaktan bağımsız tek biçimde gelir (yerel dosya ya da Sanity CDN adresi).
export const ImageRef = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  lqip: z.string().optional(),
});

// Geçersiz bir IANA adı istemcideki Intl.DateTimeFormat'ı çökertir; içerik katmanında yakalanır.
const timeZone = z.string().refine((tz) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}, "geçerli bir IANA saat dilimi değil (ör. Europe/Istanbul)");

// Case study gövdesi Portable Text blokları; yapısını @portabletext/react çözer.
const PortableBlock = z.looseObject({ _type: z.string(), _key: z.string() });

export const projectKinds = ["bitirme", "staj", "kisisel", "okul", "ogrenme"] as const;
export const ProjectKind = z.enum(projectKinds);
export const ProjectStatus = z.enum(["aktif", "tamamlandi"]);

export const Project = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().optional(),
  year: z.number().int().min(2015).max(2100),
  kind: ProjectKind,
  status: ProjectStatus,
  featured: z.boolean().default(false),
  order: z.number().int().default(100),
  tech: z.array(slug).min(1),
  links: z.object({ repo: url.optional(), demo: url.optional() }).default({}),
  // image: kartlar için 16:9; wideImage: proje sayfasının geniş kapağı için ayrı kırpım (hotspot korunur).
  cover: z.object({ mark: z.string().min(1).max(4), brand: hex, image: ImageRef.optional(), wideImage: ImageRef.optional() }),
  body: z.array(PortableBlock).default([]),
});

export const ExperienceType = z.enum(["tam-zamanli", "staj", "gonullu", "freelance"]);

export const Experience = z.object({
  id: slug,
  company: z.string().min(1),
  role: z.string().min(1),
  type: ExperienceType,
  start: month,
  end: month.nullable(),
  location: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
});

export const Education = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  start: z.number().int(),
  end: z.number().int().nullable(),
  gpa: z.string().optional(),
  note: z.string().optional(),
});

export const socialPlatforms = ["linkedin", "github", "x", "instagram"] as const;

export const Profile = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  bio: z.string().min(1),
  portrait: ImageRef.optional(),
  location: z.string().min(1),
  timeZone,
  email: z.email(),
  githubUser: z.string().min(1),
  showGithubActivity: z.boolean().default(true),
  availability: z.string().min(1),
  socials: z.array(z.object({ platform: z.enum(socialPlatforms), label: z.string(), url })).min(1),
  status: z
    .array(
      z.object({
        label: z.string(),
        title: z.string(),
        detail: z.string(),
        tone: z.enum(["mark", "ok", "info", "muted"]),
      }),
    )
    .max(3),
  workflow: z.object({ text: z.string(), steps: z.array(z.string()).min(2).max(5) }),
});

export type ImageRef = z.infer<typeof ImageRef>;
export type Technology = z.infer<typeof Technology>;
export type TechCategory = z.infer<typeof TechCategory>;
export type Project = z.infer<typeof Project>;
export type ProjectKind = z.infer<typeof ProjectKind>;
export type Experience = z.infer<typeof Experience>;
export type Education = z.infer<typeof Education>;
export type Profile = z.infer<typeof Profile>;
export type SocialPlatform = (typeof socialPlatforms)[number];
