import "server-only";
import { z } from "zod";
import { profile } from "@/content/profile";
import { technologies } from "@/content/technologies";
import { projects } from "@/content/projects";
import { experience, education } from "@/content/experience";
import { Education, Experience, Profile, Project, Technology } from "../schemas";
import type { ContentSource } from "../source";

function parse<T extends z.ZodType>(schema: T, data: unknown, label: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`İçerik doğrulama hatası (${label}):\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

function assertUnique(values: string[], label: string) {
  const seen = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) throw new Error(`İçerik doğrulama hatası (${label}): "${v}" birden fazla kez kullanılmış`);
    seen.add(v);
  }
}

// Modül yüklenirken bir kez doğrulanır: hatalı içerik build'i durdurur, canlıya çıkamaz.
const data = (() => {
  const p = parse(Profile, profile, "profile");
  const techs = parse(z.array(Technology), technologies, "technologies");
  const projs = parse(z.array(Project), projects, "projects");
  const exp = parse(z.array(Experience), experience, "experience");
  const edu = parse(z.array(Education), education, "education");

  assertUnique(techs.map((t) => t.slug), "technologies.slug");
  assertUnique(projs.map((p) => p.slug), "projects.slug");
  assertUnique(exp.map((e) => e.id), "experience.id");

  const known = new Set(techs.map((t) => t.slug));
  for (const proj of projs) {
    for (const slug of proj.tech) {
      if (!known.has(slug)) throw new Error(`İçerik doğrulama hatası (projects.${proj.slug}.tech): bilinmeyen teknoloji "${slug}"`);
    }
  }
  return { profile: p, technologies: techs, projects: projs, experience: exp, education: edu };
})();

export const localSource: ContentSource = {
  profile: async () => data.profile,
  technologies: async () => data.technologies,
  projects: async () => data.projects,
  experience: async () => data.experience,
  education: async () => data.education,
};
