import "server-only";
import { cache } from "react";
import { cookies, draftMode } from "next/headers";
import { localSource } from "./adapters/local";
import { sanitySource } from "./adapters/sanity";
import { isSanityConfigured } from "@/sanity/env";
import { isPreviewConfigured } from "@/sanity/client";
import { PERSPECTIVE_COOKIE, perspectiveFromCookie } from "@/lib/preview/perspective";
import { PUBLISHED, type ContentSource, type ReadMode } from "./source";
import type { Experience, Project, Technology } from "./schemas";

export type { Education, Experience, ImageRef, Profile, Project, ProjectKind, TechCategory, Technology } from "./schemas";

// Sanity proje kimliği tanımlıysa içerik Sanity'den gelir. CONTENT_SOURCE=local ile
// (ör. çevrimdışı geliştirme veya Sanity'den çıkış) yerel seed verisine dönülür.
export const contentSource = isSanityConfigured && process.env.CONTENT_SOURCE !== "local" ? "sanity" : "local";
// Önizleme yalnızca Sanity kaynağında ve sunucuda Viewer token'ı varken mümkündür.
export const previewAvailable = contentSource === "sanity" && isPreviewConfigured;
const source: ContentSource = contentSource === "sanity" ? sanitySource : localSource;

// draftMode() prerender sırasında false döner ve rotayı dinamik yapmaz; cookies() yalnızca draft mode içinde okunur.
// Böylece ziyaretçiler için sayfalar statik/ISR kalır.
export const getReadMode = cache(async (): Promise<ReadMode> => {
  if (!previewAvailable || !(await draftMode()).isEnabled) return PUBLISHED;
  return { preview: true, perspective: perspectiveFromCookie((await cookies()).get(PERSPECTIVE_COOKIE)?.value) };
});

export const isPreview = async () => (await getReadMode()).preview;

// Öne çıkanlar sıralarına göre, diğerleri yıla göre (yeniden eskiye).
const sortProjects = (all: Project[]) =>
  [...all].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.featured) return a.order - b.order;
    return b.year - a.year || a.title.localeCompare(b.title, "tr");
  });

const sortExperience = (all: Experience[]) => [...all].sort((a, b) => b.start.localeCompare(a.start));

export const getProfile = cache(async () => source.profile(await getReadMode()));
export const getTechnologies = cache(async () => source.technologies(await getReadMode()));
export const getEducation = cache(async () => source.education(await getReadMode()));
export const getProjects = cache(async () => sortProjects(await source.projects(await getReadMode())));
export const getExperience = cache(async () => sortExperience(await source.experience(await getReadMode())));

// Yalnızca yayımlanmış içerik; draftMode() ve cookies() ÇAĞIRMAZ.
// Build sırasında çalışanlar (generateStaticParams, sitemap, OG görseli) bunları kullanır.
export const getPublishedProjects = cache(async () => sortProjects(await source.projects(PUBLISHED)));
export const getPublishedProfile = cache(() => source.profile(PUBLISHED));

export async function getFeaturedProjects() {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export const getTechMap = cache(async () => new Map((await getTechnologies()).map((t) => [t.slug, t])));

export async function resolveTech(slugs: string[]): Promise<Technology[]> {
  const map = await getTechMap();
  return slugs.map((s) => map.get(s)).filter((t): t is Technology => Boolean(t));
}
