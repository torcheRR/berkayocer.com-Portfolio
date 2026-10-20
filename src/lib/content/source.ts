import type { Education, Experience, Profile, Project, Technology } from "./schemas";

// Okuma kipi: yayımlanmış içerik (herkes) ya da önizleme (yalnızca draft mode'daki site sahibi).
export type ReadMode = { readonly preview: false } | { readonly preview: true; readonly perspective: "drafts" | "published" };
export const PUBLISHED: ReadMode = Object.freeze({ preview: false } as const);

// Her içerik kaynağı (yerel seed, Sanity, ileride başka bir adapter) bu arayüzü uygular.
// UI yalnızca src/lib/content/index.ts'teki fonksiyonları tanır; kaynak değişince bileşenler değişmez.
// Taslak kavramı olmayan kaynaklar (yerel seed) okuma kipini yok sayabilir.
export type ContentSource = {
  profile(mode: ReadMode): Promise<Profile>;
  technologies(mode: ReadMode): Promise<Technology[]>;
  projects(mode: ReadMode): Promise<Project[]>;
  experience(mode: ReadMode): Promise<Experience[]>;
  education(mode: ReadMode): Promise<Education[]>;
};
