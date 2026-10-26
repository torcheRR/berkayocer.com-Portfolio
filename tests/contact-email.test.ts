import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, renderContactEmail, replyHref } from "../src/lib/email/contact-email";

const base = { name: "Ayşe Yılmaz", email: "ayse@example.com", subject: "Proje teklifi", message: "Merhaba,\nbir proje için yazıyorum.", sentAt: new Date("2026-10-26T09:30:00Z") };

test("formdan gelen değerler HTML'e kaçışlanarak girer", () => {
  const { html } = renderContactEmail({
    ...base,
    name: `<script>alert(1)</script>`,
    subject: `"><img src=x onerror=alert(1)>`,
    message: `<b>kalın</b> & 'tek' "çift"`,
  });
  assert.ok(!html.includes("<script>alert(1)</script>"));
  assert.ok(!html.includes("<img src=x"));
  assert.ok(!html.includes("<b>kalın</b>"));
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(html.includes("&lt;b&gt;kalın&lt;/b&gt; &amp; &#39;tek&#39; &quot;çift&quot;"));
});

test("mesajdaki satır sonları korunur", () => {
  const { html } = renderContactEmail({ ...base, message: "bir\nüç\r\ndört\rbeş" });
  assert.ok(html.includes("bir<br>üç<br>dört<br>beş"));
});

test("Yanıtla bağlantısı sorguyu bozamaz ve konuyu taşır", () => {
  assert.equal(replyHref("ayse@example.com", "Proje teklifi"), "mailto:ayse@example.com?subject=Re%3A%20Proje%20teklifi");
  // Adresteki ? ve & yüzde kodlanır; ek parametre (ör. bcc) eklenemez.
  const href = replyHref("a?bcc=x@evil.example&b@example.com", "Konu");
  assert.ok(!href.includes("?bcc"));
  assert.ok(href.startsWith("mailto:a%3Fbcc%3Dx@evil.example%26b@example.com?subject="));
});

test("tarih İstanbul saatiyle, düz metin yedeği tüm alanları içerir", () => {
  const { text, html } = renderContactEmail(base);
  assert.ok(text.includes("Ad Soyad: Ayşe Yılmaz"));
  assert.ok(text.includes("E-posta: ayse@example.com"));
  assert.ok(text.includes("Merhaba,\nbir proje için yazıyorum."));
  assert.match(text, /26 Ekim 2026 12:30/);
  assert.match(html, /26 Ekim 2026 12:30/);
});

test("escapeHtml beş özel karakteri kaçışlar", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
});

test("önizleme metni emojiyi ortadan bölmez, bozuk karakter hata vermez", () => {
  const lone = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;
  const { html } = renderContactEmail({ ...base, name: "Ali", message: "a".repeat(105) + "😀 devam eden mesaj metni" });
  assert.ok(!lone.test(html));
  // Tek kalmış vekil karakterli girdi (bozuk istemci) 500'e yol açmaz.
  assert.doesNotThrow(() => renderContactEmail({ ...base, subject: "x\udc00y", email: "a\ud800@example.com" }));
});

test("istemcinin eklediği linkler koyu zeminde okunur renkte; yön ve boşluklar korunur", () => {
  const { html } = renderContactEmail(base);
  assert.match(html, /\.autolink a \{ color: #ececee !important;/);
  assert.match(html, /<div class="autolink" dir="auto" style="[^"]*white-space:pre-wrap;/);
});
