import type { Education, Experience, Profile, Project, Technology } from "./schemas";

// Her içerik kaynağı (yerel seed, Sanity, ileride başka bir adapter) bu arayüzü uygular.
// UI yalnızca src/lib/content/index.ts'teki fonksiyonları tanır; kaynak değişince bileşenler değişmez.
export type ContentSource = {
  profile(): Promise<Profile>;
  technologies(): Promise<Technology[]>;
  projects(): Promise<Project[]>;
  experience(): Promise<Experience[]>;
  education(): Promise<Education[]>;
};
