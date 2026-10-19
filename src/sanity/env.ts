// Sanity bağlantı ayarları. Proje kimliği ve dataset gizli değildir (tarayıcıdaki Studio da kullanır).
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-10-01";

// Proje kimliği tanımlı değilse site yerel seed içeriğiyle çalışmaya devam eder.
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
