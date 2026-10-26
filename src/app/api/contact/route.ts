import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderContactEmail } from "@/lib/email/contact-email";

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 } as const;
const MIN_MESSAGE = 10;
const MIN_FILL_MS = 3000; // formu bundan hızlı dolduran büyük olasılıkla bot
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Instance başına basit hız sınırı: yalnızca gerçekten e-posta gönderilecek istekler sayılır.
// Serverless'ta instance'lar arasında paylaşılmaz; asıl koruma için platform düzeyinde
// (Vercel veya Cloudflare WAF) bir rate limit kuralı önerilir.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_KEYS = 5000;
const SWEEP_EVERY_MS = 60 * 1000;
const hits = new Map<string, number[]>();
let lastSweep = 0;

function recentHits(ip: string, now: number) {
  return (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
}

function isLimited(ip: string, now: number) {
  return recentHits(ip, now).length >= MAX_PER_WINDOW;
}

function recordHit(ip: string, now: number) {
  hits.set(ip, [...recentHits(ip, now), now]);
  if (now - lastSweep > SWEEP_EVERY_MS) {
    lastSweep = now;
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
    if (hits.size > MAX_KEYS) hits.clear();
  }
}

// Site şu an Cloudflare proxy arkasında: x-forwarded-for orada Cloudflare'in IP'si olur ve
// aynı bölgedeki tüm ziyaretçiler tek kovayı paylaşır. cf-connecting-ip gerçek istemciyi verir.
// DNS-only'ye geçildiğinde bu başlık gelmez ve Vercel'in başlıkları kullanılır.
function clientIp(req: Request) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  // Yalnızca birebir application/json: "text/plain; x=application/json" gibi preflight'sız
  // cross-site istekler burada durur.
  const contentType = req.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (contentType !== "application/json") {
    return fail("Geçersiz istek.", 415);
  }

  const fetchSite = req.headers.get("sec-fetch-site");
  const origin = req.headers.get("origin");
  let crossOrigin = Boolean(fetchSite && fetchSite !== "same-origin");
  if (origin) {
    try {
      crossOrigin ||= new URL(origin).host !== req.headers.get("host");
    } catch {
      crossOrigin = true;
    }
  }
  if (crossOrigin) return fail("Geçersiz istek.", 403);

  // Önizleme (draft mode) açıkken gerçek e-posta gönderilmez.
  if ((await draftMode()).isEnabled) return fail("Önizleme modunda form gönderilmez. Önizlemeden çıkıp tekrar dene.", 403);

  const now = Date.now();
  const ip = clientIp(req);
  if (isLimited(ip, now)) {
    return fail("Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar dene.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Geçersiz istek.", 400);
  }
  if (!body || typeof body !== "object") return fail("Geçersiz istek.", 400);

  const { name, email, subject, message, company, elapsedMs } = body as Record<string, unknown>;

  // Honeypot doluysa ya da form çok hızlı / ölçümsüz gönderildiyse bota başarı dönüp sessizce bırak.
  // Süre istemcide tek saatle ölçülür; cihaz saati yanlış olan kullanıcı etkilenmez.
  const tooFast = typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS;
  if ((typeof company === "string" && company.length > 0) || tooFast) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || typeof email !== "string" || typeof subject !== "string" || typeof message !== "string") {
    return fail("Lütfen tüm alanları doldurun.", 400);
  }

  const clean = {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  };

  if (!clean.name || !clean.email || !clean.subject || !clean.message) {
    return fail("Lütfen tüm alanları doldurun.", 400);
  }
  if (
    clean.name.length > LIMITS.name ||
    clean.email.length > LIMITS.email ||
    clean.subject.length > LIMITS.subject ||
    clean.message.length > LIMITS.message
  ) {
    return fail("Alanlardan biri izin verilen uzunluğu aşıyor.", 400);
  }
  if (clean.message.length < MIN_MESSAGE) {
    return fail(`Mesaj en az ${MIN_MESSAGE} karakter olmalı.`, 400);
  }
  if (!EMAIL_RE.test(clean.email)) {
    return fail("Geçerli bir e-posta adresi girin.", 400);
  }
  // Başlığa giden alanlarda satır sonu header injection'a kapı açar.
  if (/[\r\n]/.test(clean.name + clean.email + clean.subject)) {
    return fail("Geçersiz karakter.", 400);
  }

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_TO } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.error("/api/contact: e-posta ortam değişkenleri eksik");
    return fail("Mesaj gönderilirken bir hata oluştu.", 500);
  }

  const port = Number(EMAIL_PORT || 587);
  recordHit(ip, now);

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });

    // Sitenin görünümünde HTML; HTML göstermeyen istemciler için düz metin de gider.
    const { html, text } = renderContactEmail({ ...clean, sentAt: new Date() });
    await transporter.sendMail({
      from: `Portfolio Form <${EMAIL_USER}>`,
      to: EMAIL_TO || EMAIL_USER,
      subject: `[Portfolio] ${clean.subject}`,
      replyTo: clean.email,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/contact gönderim hatası:", error instanceof Error ? error.message : "bilinmeyen hata");
    return fail("Mesaj gönderilirken bir hata oluştu.", 500);
  }
}
