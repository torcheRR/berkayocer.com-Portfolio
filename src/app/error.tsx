"use client";

// Site kabuğu ((site)/layout) dahil, kök layout altındaki hatalar için son çare sayfası.
// Site CSS'i burada içe aktarılmaz (Studio'ya sızmasın); stiller satır içi.
// Önizlemedeyken içerik alınamazsa (ör. token geçersiz) önizleme şeridi de çizilemez; çıkış düğmesi burada.
const s = {
  wrap: { minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24, background: "#0a0a0b", color: "#ececee", fontFamily: "ui-monospace, Menlo, monospace" },
  card: { maxWidth: 480, display: "grid", gap: 14, border: "1px solid #2a2d33", borderRadius: 14, padding: 24, background: "#0e0f11" },
  muted: { color: "#a3a6ad", fontSize: 14, lineHeight: 1.5, margin: 0 },
  row: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" },
  primary: { border: 0, borderRadius: 999, padding: "8px 16px", background: "#ececee", color: "#0a0a0b", font: "inherit", fontSize: 13, cursor: "pointer" },
  link: { color: "#ececee", fontSize: 13 },
  small: { color: "#7c808a", fontSize: 12, margin: 0 },
  ghost: { border: "1px solid #facc15", borderRadius: 999, padding: "4px 12px", background: "transparent", color: "#facc15", font: "inherit", fontSize: 12, cursor: "pointer" },
} satisfies Record<string, React.CSSProperties>;

// retry: sayfayı sunucudan yeniden ister (router.refresh + sınırı sıfırlama); reset yalnızca istemcide yeniden çizerdi.
export default function RootError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main style={s.wrap}>
      <div style={s.card}>
        <span style={s.small}>Fig. 500</span>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: "-0.04em" }}>Bir şeyler ters gitti</h1>
        <p style={s.muted}>Sayfa şu an yüklenemedi. Biraz sonra tekrar dene.</p>
        <div style={s.row}>
          <button type="button" onClick={() => retry()} style={s.primary}>
            Tekrar dene
          </button>
          {/* Bilinçli olarak tam sayfa yükleme: hata sonrası uygulama durumu sıfırlansın. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={s.link}>
            Ana sayfaya dön
          </a>
        </div>
        <form method="post" action="/api/draft-mode/disable" style={{ ...s.row, borderTop: "1px solid #1e2024", paddingTop: 14 }}>
          <p style={s.small}>Site sahibi misin ve önizleme modundaysan:</p>
          <input type="hidden" name="redirect" value="/" />
          <button type="submit" style={s.ghost}>
            Önizlemeden çık
          </button>
        </form>
      </div>
    </main>
  );
}
