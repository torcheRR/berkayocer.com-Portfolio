// İstemci bileşenlerinde de kullanılabilen etiketler ve biçimlendiriciler (server-only değil).
import type { ProjectKind, TechCategory } from "./schemas";

export const kindLabel: Record<ProjectKind, string> = {
  bitirme: "Bitirme projesi",
  staj: "Staj",
  kisisel: "Kişisel",
  okul: "Okul",
  ogrenme: "Öğrenme",
};

export const categoryLabel: Record<TechCategory, string> = {
  dil: "Dil",
  frontend: "Frontend",
  backend: "Backend",
  mobil: "Mobil",
  veri: "Veri",
  arac: "Araç",
};

// Kategorilerin görüntülenme sırası (zod'u istemci paketine çekmemek için şemadan değil buradan).
export const techCategoryOrder = Object.keys(categoryLabel) as TechCategory[];

export const statusLabel = { aktif: "Aktif", tamamlandi: "Tamamlandı" } as const;

export const experienceTypeLabel = {
  "tam-zamanli": "Tam zamanlı",
  staj: "Staj",
  gonullu: "Gönüllü",
  freelance: "Freelance",
} as const;

// "2025-07" → "2025/07"
export const formatMonth = (m: string) => m.replace("-", "/");

export function formatPeriod(start: string, end: string | null) {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "şimdi"}`;
}
