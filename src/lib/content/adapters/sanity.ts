import "server-only";
import { z } from "zod";
import { defineQuery } from "next-sanity";
import { sanityFetch, urlFor } from "@/sanity/client";
import { Education, Experience, Profile, Project, Technology, type ImageRef } from "../schemas";
import type { ContentSource } from "../source";

// Sanity'deki çok dilli alanlardan bugün yalnızca Türkçe okunur.
type L10n = { tr?: string; en?: string } | null | undefined;
const tr = (v: L10n) => v?.tr ?? "";

type Crop = { top?: number; bottom?: number; left?: number; right?: number };
type SanityImage = {
  // GROQ'ta asset->{...} ile çözüldüğü için referans (_ref) değil belge kimliği (_id) gelir.
  asset?: { _id?: string; _ref?: string; metadata?: { dimensions?: { width: number; height: number }; lqip?: string } };
  crop?: Crop;
  hotspot?: unknown;
  alt?: string;
} | null;

// Görsel hotspot/crop'a göre istenen oranda kırpılır; boyutlar CLS olmaması için baştan bilinir.
function image(img: SanityImage, width: number, height: number): ImageRef | undefined {
  if (!(img?.asset?._id ?? img?.asset?._ref) || !img?.alt) return undefined;
  return {
    url: urlFor(img).width(width).height(height).fit("crop").auto("format").quality(80).url(),
    alt: img.alt,
    width,
    height,
    lqip: img.asset?.metadata?.lqip,
  };
}

// Gövde görselleri editörün kırpımıyla aynı oranda istenir (ek kırpma olmaz).
function bodyImage(img: SanityImage, width = 1600): ImageRef | undefined {
  const dims = img?.asset?.metadata?.dimensions;
  if (!dims) return image(img, width, Math.round((width * 9) / 16));
  const c = img?.crop ?? {};
  const effW = dims.width * (1 - (c.left ?? 0) - (c.right ?? 0));
  const effH = dims.height * (1 - (c.top ?? 0) - (c.bottom ?? 0));
  return image(img, width, Math.max(1, Math.round((width * effH) / effW)));
}

const imageFields = `{ ..., asset->{ _id, metadata { lqip, dimensions } } }`;

const profileQuery = defineQuery(`*[_type == "profile" && _id == "profile"][0]{
  ..., portrait${imageFields}
}`);
const technologiesQuery = defineQuery(`*[_type == "technology"] | order(orderRank asc)`);
const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(orderRank asc){
  ..., "slug": slug.current, "tech": tech[]->slug.current, cover{ ..., image${imageFields} },
  body[]{ ..., _type == "image" => ${imageFields} }
}`);
const experienceQuery = defineQuery(`*[_type == "experience"] | order(start desc)`);
const educationQuery = defineQuery(`*[_type == "education"] | order(start desc)`);

// Hatalı tek bir kaydın tüm siteyi düşürmemesi için liste öğeleri tek tek doğrulanır; geçersizler loglanıp atlanır.
function parseList<T extends z.ZodType>(schema: T, items: unknown[], label: string): z.infer<T>[] {
  return items.flatMap((item, i) => {
    const r = schema.safeParse(item);
    if (r.success) return [r.data];
    console.error(`[sanity] ${label}[${i}] atlandı:\n${z.prettifyError(r.error)}`);
    return [];
  });
}

/* eslint-disable @typescript-eslint/no-explicit-any -- GROQ sonuçları burada Zod ile doğrulanıyor */
export const sanitySource: ContentSource = {
  async profile() {
    const p = await sanityFetch<any>(profileQuery, ["profile"]);
    if (!p) {
      throw new Error(
        "Sanity: 'profile' belgesi bulunamadı. Önce `npm run seed:sanity` ile içeriği taşı ya da yerelde /studio'dan Profil'i doldurup yayımla.",
      );
    }
    const result = Profile.safeParse({
      name: p.name,
      role: p.role,
      tagline: tr(p.tagline),
      bio: tr(p.bio),
      portrait: image(p.portrait, 600, 600),
      location: tr(p.location),
      timeZone: p.timeZone,
      email: p.email,
      githubUser: p.githubUser,
      showGithubActivity: p.showGithubActivity ?? true,
      availability: tr(p.availability),
      socials: p.socials ?? [],
      status: (p.status ?? []).map((s: any) => ({ label: tr(s.label), title: tr(s.title), detail: tr(s.detail), tone: s.tone })),
      workflow: { text: tr(p.workflow?.text), steps: p.workflow?.steps ?? [] },
    });
    if (!result.success) throw new Error(`Sanity profil doğrulama hatası:\n${z.prettifyError(result.error)}`);
    return result.data;
  },

  async technologies() {
    const docs = await sanityFetch<any[]>(technologiesQuery, ["technology"]);
    return parseList(
      Technology,
      docs.map((t) => ({ slug: t.slug?.current, name: t.name, categories: t.categories, color: t.color, url: t.url, inStack: t.inStack ?? false })),
      "technology",
    );
  },

  async projects() {
    const docs = await sanityFetch<any[]>(projectsQuery, ["project", "technology"]);
    return parseList(
      Project,
      docs.map((p, i) => {
        let figure = 0;
        return {
          slug: p.slug,
          title: p.title,
          summary: tr(p.summary),
          description: tr(p.description) || undefined,
          year: p.year,
          kind: p.kind,
          status: p.status,
          featured: p.featured ?? false,
          order: i + 1,
          // Silinmiş teknoloji referansları null döner; atılır.
          tech: (p.tech ?? []).filter(Boolean),
          links: { repo: p.links?.repo, demo: p.links?.demo },
          cover: {
            mark: p.cover?.mark,
            brand: p.cover?.brand,
            image: image(p.cover?.image, 1600, 900),
            wideImage: image(p.cover?.image, 2100, 800),
          },
          body: (p.body ?? []).map((b: any) => {
            if (b._type !== "image") return b;
            const img = bodyImage(b);
            // Figür numarası yalnızca görseller arasında sayılır.
            return { _type: "image", _key: b._key, caption: b.caption, image: img, figure: img ? ++figure : undefined };
          }),
        };
      }),
      "project",
    );
  },

  async experience() {
    const docs = await sanityFetch<any[]>(experienceQuery, ["experience"]);
    return parseList(
      Experience,
      docs.map((e) => ({
        id: e._id.replace(/[^a-z0-9-]/gi, "-").toLowerCase(),
        company: e.company,
        role: tr(e.role),
        type: e.type,
        start: e.start,
        end: e.end || null,
        location: tr(e.location),
        summary: tr(e.summary),
        tags: e.tags ?? [],
      })),
      "experience",
    );
  },

  async education() {
    const docs = await sanityFetch<any[]>(educationQuery, ["education"]);
    return parseList(
      Education,
      docs.map((e) => ({
        school: e.school,
        degree: tr(e.degree),
        start: e.start,
        end: e.end ?? null,
        gpa: e.gpa || undefined,
        note: tr(e.note) || undefined,
      })),
      "education",
    );
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */
