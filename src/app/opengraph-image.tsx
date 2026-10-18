import { ImageResponse } from "next/og";

export const alt = "Berkay ÖCER · Yazılım Mühendisi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME = "Berkay ÖCER";
const ROLE = "Yazılım Mühendisi";
const META = "berkayocer.com · İstanbul";

// Satori woff2 okuyamıyor; tarayıcı user-agent'ı olmadan Google Fonts TTF döndürür.
// Türkçe karakterler (ı, ş, ğ, İ) varsayılan fontta olmayabileceği için Geist'i yüklüyoruz.
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const cssRes = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!cssRes.ok) throw new Error("Font CSS'i alınamadı");
  const css = await cssRes.text();
  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!resource) throw new Error("Font kaynağı bulunamadı");
  const res = await fetch(resource[1], { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error("Font indirilemedi");
  return res.arrayBuffer();
}

export default async function OpengraphImage() {
  const text = `${NAME}${ROLE}${META}`;
  let fonts: { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }[] = [];
  try {
    const [regular, semibold] = await Promise.all([
      loadGoogleFont("Geist", 400, text),
      loadGoogleFont("Geist", 600, text),
    ]);
    fonts = [
      { name: "Geist", data: regular, weight: 400, style: "normal" },
      { name: "Geist", data: semibold, weight: 600, style: "normal" },
    ];
  } catch {
    // Ağ yoksa varsayılan fontla devam et.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0b0b",
          color: "#e6e6e6",
          fontFamily: fonts.length ? "Geist" : undefined,
          backgroundImage:
            "linear-gradient(#1e2024 1px, transparent 1px), linear-gradient(90deg, #1e2024 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#a3a6ad" }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: "#facc15" }} />
          {META}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>{NAME}</div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                fontSize: 44,
                color: "#0b0b0b",
                background: "#facc15",
                padding: "6px 18px",
                borderRadius: 8,
              }}
            >
              {ROLE}
            </div>
          </div>
        </div>
      </div>
    ),
    // Boş fonts dizisi Satori'yi çökertir; font yoksa @vercel/og'un varsayılanı kullanılsın.
    { ...size, ...(fonts.length ? { fonts } : {}) }
  );
}
