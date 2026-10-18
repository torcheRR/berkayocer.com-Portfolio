import { ImageResponse } from "next/og";

export const alt = "Berkay Öcer · Yazılım Mühendisi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME = "Berkay Öcer";
const ROLE = "Yazılım Mühendisi";
const META = "BO/26 · berkayocer.com · İstanbul";
const FIG = "Fig. 1 · Bileşen bileşen, katman katman.";

// Satori woff2 okuyamıyor; tarayıcı user-agent'ı olmadan Google Fonts TTF döndürür.
// Türkçe karakterler (ı, ş, ğ, İ) için Geist Mono yükleniyor.
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
  const text = `${NAME}${ROLE}${META}${FIG}`;
  let fonts: { name: string; data: ArrayBuffer; weight: 400 | 500; style: "normal" }[] = [];
  try {
    const [regular, medium] = await Promise.all([
      loadGoogleFont("Geist+Mono", 400, text),
      loadGoogleFont("Geist+Mono", 500, text),
    ]);
    fonts = [
      { name: "Geist Mono", data: regular, weight: 400, style: "normal" },
      { name: "Geist Mono", data: medium, weight: 500, style: "normal" },
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
          padding: "64px 80px",
          background: "#0a0a0b",
          color: "#ececee",
          fontFamily: fonts.length ? "Geist Mono" : undefined,
          backgroundImage:
            "linear-gradient(#1e2024 1px, transparent 1px), linear-gradient(90deg, #1e2024 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6c7079" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#facc15" }} />
            {META}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 112, fontWeight: 500, letterSpacing: -6, lineHeight: 1 }}>{NAME}</div>
          <div style={{ display: "flex", fontSize: 40, color: "#a3a6ad" }}>
            <div style={{ display: "flex", position: "relative", color: "#ececee" }}>
              <div
                style={{
                  position: "absolute",
                  left: -4,
                  right: -4,
                  bottom: 4,
                  height: 20,
                  background: "rgba(250, 204, 21, 0.35)",
                  borderRadius: 3,
                }}
              />
              {ROLE}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#6c7079" }}>{FIG}</div>
      </div>
    ),
    // Boş fonts dizisi Satori'yi çökertir; font yoksa @vercel/og'un varsayılanı kullanılsın.
    { ...size, ...(fonts.length ? { fonts } : {}) }
  );
}
