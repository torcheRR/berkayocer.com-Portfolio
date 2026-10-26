// İletişim formundan gelen mesajın e-postası: sitenin görünümünde HTML + düz metin yedeği.
// E-posta istemcileri için yazıldı: tablo düzeni ve satır içi stiller. Küçük <style> bloğu yalnızca istemcilerin
// kendi eklediği linklerin rengini düzeltir. Tek harici kaynak Geist yazı tipi (Gmail yok sayar, sistem fontu kullanılır).
// Formdan gelen her değer HTML'e kaçışlanarak girer.

export type ContactMessage = { name: string; email: string; subject: string; message: string; sentAt: Date };

const C = {
  canvas: "#0a0a0b",
  panel: "#0e0f11",
  line: "#1e2024",
  ink: "#ececee",
  ink2: "#a3a6ad",
  ink3: "#7c808a",
  mark: "#facc15",
  onMark: "#15130a",
};
const MONO = "'Geist Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const SANS = "Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const SITE = "https://berkayocer.com";

// Tek kalmış UTF-16 vekil karakterleri (bozuk girdi) � ile değiştirilir; kodlama ve URL üretimi hata vermesin.
const wellFormed = (value: string) => value.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "\uFFFD");

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPES[c]);

// Satır sonları korunur (Gmail white-space'e her yerde uymaz; <br> güvenli).
const multiline = (value: string) => escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>");

// mailto: adres yüzde kodlanır ("?" ya da "&" içeren bir adres sorguyu bozamaz), @ okunur kalır.
export function replyHref(email: string, subject: string) {
  const to = encodeURIComponent(wellFormed(email)).replace(/%40/g, "@");
  return `mailto:${to}?subject=${encodeURIComponent(`Re: ${wellFormed(subject)}`)}`;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "long", timeStyle: "short" }).format(date);

// Gelen kutusu önizlemesinde görünen kısa metin; sonuna gövdenin sızmaması için boş karakterler eklenir.
const preheader = (m: ContactMessage) => {
  // Kod noktasına göre kesilir: emoji ortadan bölünüp önizlemede � görünmez.
  const snippet = Array.from(m.message.replace(/\s+/g, " ").trim()).slice(0, 110).join("");
  return `${escapeHtml(`${m.name}: ${snippet}`)}${"&#8199;&#847;".repeat(40)}`;
};

const label = (text: string) =>
  `<div style="margin:0 0 6px;font-family:${MONO};font-size:11px;line-height:16px;letter-spacing:0.04em;color:${C.ink3};">${text}</div>`;

const row = (title: string, valueHtml: string) => `
          <tr>
            <td style="border-top:1px solid ${C.line};padding:14px 22px;">
              ${label(title)}
              <div dir="auto" style="font-family:${SANS};font-size:15px;line-height:22px;color:${C.ink};word-break:break-word;">${valueHtml}</div>
            </td>
          </tr>`;

export function renderContactEmail(input: ContactMessage) {
  const m = { ...input, name: wellFormed(input.name), email: wellFormed(input.email), subject: wellFormed(input.subject), message: wellFormed(input.message) };
  const date = formatDate(m.sentAt);
  const reply = replyHref(m.email, m.subject);

  const html = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${escapeHtml(m.subject)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    /* Gmail ve Apple Mail metindeki adresleri kendi mavisiyle linkler; koyu zeminde okunur kalsın. */
    .autolink a { color: ${C.ink} !important; text-decoration: underline !important; }
    .autolink-muted a { color: ${C.ink3} !important; text-decoration: none !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.canvas};" bgcolor="${C.canvas}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader(m)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.canvas}" style="background:${C.canvas};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td style="padding:0 2px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="30" style="width:30px;">
                    <div style="width:30px;height:30px;border-radius:50%;background:${C.ink};color:${C.canvas};font-family:${MONO};font-size:11px;font-weight:500;line-height:30px;text-align:center;">BÖ</div>
                  </td>
                  <td class="autolink-muted" style="padding-left:10px;font-family:${MONO};font-size:12px;line-height:16px;color:${C.ink3};">berkayocer.com · İletişim formu</td>
                  <td align="right" style="font-family:${MONO};font-size:12px;line-height:16px;color:${C.ink3};">Fig. 06</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="${C.panel}" style="background:${C.panel};border:1px solid ${C.line};border-radius:14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:20px 22px 6px;font-family:${MONO};font-size:11px;line-height:16px;letter-spacing:0.04em;color:${C.ink3};">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${C.mark};margin-right:8px;vertical-align:1px;"></span>YENİ MESAJ
                  </td>
                </tr>
                <tr>
                  <td dir="auto" style="padding:0 22px 18px;font-family:${MONO};font-size:22px;line-height:28px;font-weight:500;letter-spacing:-0.02em;color:${C.ink};word-break:break-word;">${escapeHtml(m.subject)}</td>
                </tr>
                ${row("AD SOYAD", escapeHtml(m.name))}
                ${row("E-POSTA", `<a href="${escapeHtml(reply)}" style="color:${C.ink};text-decoration:underline;text-decoration-color:${C.mark};">${escapeHtml(m.email)}</a>`)}
                ${row("TARİH", escapeHtml(date))}
                <tr>
                  <td style="border-top:1px solid ${C.line};padding:18px 22px 6px;">
                    ${label("MESAJ")}
                    <div class="autolink" dir="auto" style="font-family:${SANS};font-size:15px;line-height:24px;color:${C.ink2};white-space:pre-wrap;word-break:break-word;">${multiline(m.message)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 22px 22px;">
                    <a href="${escapeHtml(reply)}" style="display:inline-block;background:${C.mark};color:${C.onMark};font-family:${SANS};font-size:13px;line-height:18px;font-weight:600;text-decoration:none;padding:10px 18px;border-radius:999px;">Yanıtla &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 2px 0;font-family:${MONO};font-size:11px;line-height:17px;color:${C.ink3};">
              Bu mesaj <a href="${SITE}/#iletisim" style="color:${C.ink3};text-decoration:underline;">berkayocer.com</a> iletişim formundan gönderildi. "Yanıtla" doğrudan gönderene yazar.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // HTML göstermeyen istemciler ve bildirim önizlemeleri için.
  const text = `Ad Soyad: ${m.name}\nE-posta: ${m.email}\nTarih: ${date}\n\nMesaj:\n${m.message}\n\n— berkayocer.com iletişim formu`;

  return { html, text };
}
