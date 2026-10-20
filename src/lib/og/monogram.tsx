import { ImageResponse } from "next/og";
import { loadGoogleFont } from "./google-font";

const TEXT = "BÖ";
const INK = "#ececee";
const CANVAS = "#0a0a0b";

// Menüdeki "BÖ" rozetiyle aynı: açık daire, koyu Geist Mono harfler.
// Küçük boyutta okunsun diye harf oranı rozettekinden biraz büyük.
// backdrop: Apple ikonlarında köşeler sistemce yuvarlatılır ve saydamlık siyaha döner; zemin site rengi olur.
export async function renderMonogram(size: number, { backdrop = false }: { backdrop?: boolean } = {}) {
  let fonts: { name: string; data: ArrayBuffer; weight: 500; style: "normal" }[] = [];
  try {
    fonts = [{ name: "Geist Mono", data: await loadGoogleFont("Geist+Mono", 500, TEXT), weight: 500, style: "normal" }];
  } catch {
    // Ağ yoksa varsayılan fontla devam et.
  }
  const circle = backdrop ? Math.round(size * 0.78) : size;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: backdrop ? CANVAS : "transparent" }}>
        <div
          style={{
            width: circle,
            height: circle,
            borderRadius: "50%",
            background: INK,
            color: CANVAS,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.length ? "Geist Mono" : undefined,
            fontWeight: 500,
            fontSize: Math.round(circle * 0.42),
            letterSpacing: -circle * 0.02,
          }}
        >
          {TEXT}
        </div>
      </div>
    ),
    // Boş fonts dizisi Satori'yi çökertir; font yoksa @vercel/og'un varsayılanı kullanılsın.
    { width: size, height: size, ...(fonts.length ? { fonts } : {}) },
  );
}
