import type { FilterDefault, StegaConfig } from "next-sanity";
import { studioUrl } from "./env";

// Önizlemede yalnızca ekranda düz metin olarak görünen alanlar görünmez işaret (stega) taşır; tıkla-düzenle bunlarla çalışır.
// Liste dışındaki her alan temiz kalır: enum, regex, saat dilimi, slug, URL, e-posta, renk, kullanıcı adı, sosyal etiketler, tarihler.
// Listeye alan eklemeden önce kullanıldığı yerlere bak: attribute, key, karşılaştırma, URL ya da Intl'e gidiyorsa EKLEME.
const ENCODED: Record<string, ReadonlySet<string>> = {
  profile: new Set([
    "name",
    "role",
    "tagline.tr",
    "bio.tr",
    "location.tr",
    "availability.tr",
    "status.label.tr",
    "status.title.tr",
    "status.detail.tr",
    "workflow.text.tr",
    "workflow.steps",
    "portrait.alt",
  ]),
  project: new Set(["title", "summary.tr", "description.tr", "cover.image.alt", "body.children.text", "body.caption", "body.alt"]),
  technology: new Set(["name"]),
  experience: new Set(["company", "role.tr", "location.tr", "summary.tr", "tags"]),
  education: new Set(["school", "degree.tr", "gpa", "note.tr"]),
};

type SourcePath = Parameters<FilterDefault>[0]["sourcePath"];

// Dizi indeksleri ve {_key} parçaları atılır: status[_key=="s0"].title.tr -> "status.title.tr"
export const fieldKey = (path: SourcePath) => path.filter((s): s is string => typeof s === "string").join(".");

export const stegaFilter: FilterDefault = (props) =>
  // Boş değer boş kalmalı: `x || undefined` ve Zod min(1) yayımlanmış içerikteki gibi davranır.
  props.value.trim() !== "" &&
  (ENCODED[props.sourceDocument._type]?.has(fieldKey(props.sourcePath)) ?? false) &&
  // İkinci kalkan: Sanity'nin kendi kuralları (URL, tarih, slug.current, _ ile başlayan alanlar).
  props.filterDefault(props);

export const previewStega = { enabled: true, studioUrl, filter: stegaFilter } satisfies StegaConfig;
