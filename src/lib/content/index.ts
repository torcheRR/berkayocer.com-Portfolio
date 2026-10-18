import "server-only";
import { cache } from "react";
import { localSource } from "./adapters/local";
import type { ContentSource } from "./source";
import type { Project, Technology } from "./schemas";

export type { Education, Experience, Profile, Project, ProjectKind, TechCategory, Technology } from "./schemas";

const source: ContentSource = localSource;

export const getProfile = cache(() => source.profile());
export const getTechnologies = cache(() => source.technologies());
export const getEducation = cache(() => source.education());

// Öne çıkanlar sıralarına göre, diğerleri yıla göre (yeniden eskiye).
export const getProjects = cache(async (): Promise<Project[]> => {
  const all = await source.projects();
  return [...all].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.featured) return a.order - b.order;
    return b.year - a.year || a.title.localeCompare(b.title, "tr");
  });
});

export async function getFeaturedProjects() {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export const getExperience = cache(async () => {
  const all = await source.experience();
  return [...all].sort((a, b) => b.start.localeCompare(a.start));
});

export const getTechMap = cache(async () => new Map((await getTechnologies()).map((t) => [t.slug, t])));

export async function resolveTech(slugs: string[]): Promise<Technology[]> {
  const map = await getTechMap();
  return slugs.map((s) => map.get(s)).filter((t): t is Technology => Boolean(t));
}
