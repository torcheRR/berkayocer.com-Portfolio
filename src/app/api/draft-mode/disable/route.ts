import { cookies, draftMode } from "next/headers";
import { safeRedirectPath } from "@/lib/preview/redirect";

// Önizlemeden çıkış. Yalnızca POST: bir link önyüklemesi (prefetch) önizlemeyi yanlışlıkla kapatamaz.
export const dynamic = "force-dynamic";

// Presentation'ın yazdığı yardımcı çerezler (@sanity/preview-url-secret ve next-sanity sabitleri).
const PREVIEW_COOKIES = ["sanity-preview-perspective", "sanity-preview-variant", "sanity-preview-partitioned"];

export async function POST(request: Request) {
  (await draftMode()).disable();
  const jar = await cookies();
  for (const name of PREVIEW_COOKIES) jar.delete({ name, path: "/" });
  const form = await request.formData().catch(() => null);
  // 303: tarayıcı hedefe GET ile gider; çıkış sonrası sayfa yeniden önbellekten gelir.
  return new Response(null, { status: 303, headers: { Location: safeRedirectPath(form?.get("redirect")) } });
}
