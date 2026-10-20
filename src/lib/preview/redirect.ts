// Önizlemeden çıkınca dönülecek adres: yalnızca aynı origin'de bir yol. "//evil", "/\evil", tam URL ve
// kontrol karakterleri reddedilir; geçersizse ana sayfa.
const BASE = "http://site.invalid";

export function safeRedirectPath(raw: unknown): string {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  if (/[\u0000-\u001f\u007f]/.test(raw)) return "/";
  try {
    const url = new URL(raw, BASE);
    if (url.origin !== BASE) return "/";
    // Nokta segmentleri ayrıştırılınca "//host" oluşabilir ("/.//evil" -> "//evil"); sonuç da denetlenir.
    // Ters bölüler ayrıştırmada "/" olur, bu denetim onları da kapsar.
    const out = `${url.pathname}${url.search}${url.hash}`;
    return out.startsWith("//") ? "/" : out;
  } catch {
    return "/";
  }
}
