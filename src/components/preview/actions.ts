"use server";

import { cookies, draftMode } from "next/headers";
import { refresh } from "next/cache";
import { PERSPECTIVE_COOKIE, perspectiveFromCookie } from "@/lib/preview/perspective";

// Presentation'da perspektif (Taslaklar / Yayımlanmış) değişince çağrılır.
// next-sanity'nin hazır aksiyonu yerine bu: draft mode dışında hiçbir şey yapmaz (aksiyon kimliğini bilen biri
// ziyaretçi sayfalarını dinamik olarak yeniden çizdiremez) ve değer aynıysa yenilemez (iframe her bağlanışta bildirir).
export async function changePreviewPerspective(perspective: unknown) {
  if (!(await draftMode()).isEnabled) return;
  // Yalnızca taslak ve yayımlanmış desteklenir; release yığınları taslak olarak okunur.
  const next = perspectiveFromCookie(typeof perspective === "string" ? perspective : undefined);
  const jar = await cookies();
  if (perspectiveFromCookie(jar.get(PERSPECTIVE_COOKIE)?.value) === next && jar.has(PERSPECTIVE_COOKIE)) return;
  const secure = process.env.NODE_ENV === "production";
  jar.set(PERSPECTIVE_COOKIE, next, {
    httpOnly: true,
    path: "/",
    secure,
    sameSite: secure ? "none" : "lax",
    partitioned: jar.has("sanity-preview-partitioned"),
  });
  refresh();
}
