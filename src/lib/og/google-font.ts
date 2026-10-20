// Satori woff2 okuyamıyor; tarayıcı user-agent'ı olmadan Google Fonts TTF döndürür.
// Yalnızca verilen metindeki karakterler indirilir (Türkçe harfler dahil).
export async function loadGoogleFont(family: string, weight: number, text: string) {
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
