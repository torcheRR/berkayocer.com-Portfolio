import "server-only";
import { createClient } from "next-sanity";
import { draftMode } from "next/headers";
import { createImageUrlBuilder } from "@sanity/image-url";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";
import { previewStega } from "./stega";
import type { ReadMode } from "@/lib/content/source";

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

// Viewer yetkili token: yalnızca sunucuda. Taslakları okur ve Presentation'ın önizleme anahtarını doğrular.
// Asla NEXT_PUBLIC_ önekiyle tanımlanmaz, yazma token'ı kullanılmaz.
const readToken = process.env.SANITY_API_READ_TOKEN?.trim() || undefined;
export const isPreviewConfigured = isSanityConfigured && Boolean(readToken);

// Önizleme istemcisi: taslaklar + tıkla-düzenle için görünmez işaretler. Yalnızca draft mode'da kullanılır.
const previewClient = readToken ? client.withConfig({ token: readToken, useCdn: false, perspective: "drafts", stega: previewStega }) : null;

// Yalnızca /api/draft-mode/enable kullanır (Presentation'ın anahtar belgesini okur; stega yok).
export const draftModeClient = readToken ? client.withConfig({ token: readToken, useCdn: false }) : null;

// Webhook bir türün etiketini anında geçersiz kılar (bkz. app/api/revalidate).
// Webhook kaçarsa içerik en geç bu süre sonunda yenilenir.
const SAFETY_REVALIDATE_SECONDS = 3600;

// Bütün Sanity okumaları buradan geçer. Okuma kipi zorunlu: her çağıran yayımlanmış mı önizleme mi okuduğuna karar verir.
export async function sanityFetch<T>(query: string, tags: readonly string[], mode: ReadMode): Promise<T> {
  if (mode.preview) {
    if (!previewClient) throw new Error("Önizleme için SANITY_API_READ_TOKEN tanımlı olmalı.");
    // İkinci kalkan: taslak içerik draft mode dışında hiçbir koşulda okunmaz.
    if (!(await draftMode()).isEnabled) throw new Error("Taslak içerik yalnızca draft mode'da okunur.");
    // Önbelleğe yazılmaz: draft mode Data Cache'i zaten atlar; ayrıca no-store ve etiketsiz.
    return previewClient.fetch<T>(query, {}, { perspective: mode.perspective, cache: "no-store" });
  }
  // Geliştirmede webhook localhost'a ulaşamaz; Studio'daki değişiklik normal yenilemede görünsün.
  if (process.env.NODE_ENV === "development") {
    return client.fetch<T>(query, {}, { cache: "no-store" });
  }
  return client.fetch<T>(query, {}, { cache: "force-cache", next: { tags: ["sanity", ...tags], revalidate: SAFETY_REVALIDATE_SECONDS } });
}
