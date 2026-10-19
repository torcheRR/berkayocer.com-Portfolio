import "server-only";
import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "./env";

// Yalnızca yayımlanmış içerik okunur (dataset public, token gerekmez).
// useCdn kapalı: önbelleği Next tutuyor. API CDN'i yayından hemen sonra eski yanıt
// dönebildiği için, webhook sonrası ilk çekimde eski içeriğin önbelleğe yazılmasını önler.
export const client = createClient({
  projectId: projectId || "unset",
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

const builder = createImageUrlBuilder({ projectId: projectId || "unset", dataset });
export const urlFor = (source: Parameters<typeof builder.image>[0]) => builder.image(source);

// Webhook bir türün etiketini anında geçersiz kılar (bkz. app/api/revalidate).
// Webhook kaçarsa içerik en geç bu süre sonunda yenilenir.
const SAFETY_REVALIDATE_SECONDS = 3600;

export function sanityFetch<T>(query: string, tags: readonly string[]) {
  // Geliştirmede webhook localhost'a ulaşamaz; Studio'daki değişiklik normal yenilemede görünsün.
  if (process.env.NODE_ENV === "development") {
    return client.fetch<T>(query, {}, { cache: "no-store" });
  }
  return client.fetch<T>(query, {}, { cache: "force-cache", next: { tags: ["sanity", ...tags], revalidate: SAFETY_REVALIDATE_SECONDS } });
}
