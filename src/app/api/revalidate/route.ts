import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { SIGNATURE_HEADER_NAME, decodeSignatureHeader, isValidSignature } from "@sanity/webhook";

const knownTypes = new Set(["profile", "project", "technology", "experience", "education"]);
const MAX_BODY_BYTES = 64 * 1024;
const MAX_SIGNATURE_AGE_MS = 5 * 60 * 1000; // ele geçirilmiş eski bir isteğin tekrar oynatılmasını önler
const CONSISTENCY_WAIT_MS = 3000; // Content Lake'in yeni sürümü her yerde döndürmesi için kısa bekleme

const reply = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

// Sanity webhook'u: Studio'da "Yayınla"ya basılınca ilgili içeriğin önbelleği hemen düşürülür,
// sayfa bir sonraki ziyarette yeni içerikle üretilir. Redeploy gerekmez.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    console.error("/api/revalidate: SANITY_REVALIDATE_SECRET tanımlı değil");
    return reply(500, { ok: false, error: "Yapılandırma eksik" });
  }

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return reply(413, { ok: false, error: "Gövde çok büyük" });
  }

  const raw = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) return reply(401, { ok: false, error: "İmza yok" });

  let validSignature = false;
  let timestamp = 0;
  try {
    validSignature = await isValidSignature(raw, signature, secret);
    timestamp = decodeSignatureHeader(signature).timestamp;
  } catch {
    validSignature = false;
  }
  if (!validSignature) return reply(401, { ok: false, error: "Geçersiz imza" });

  // Zaman damgası ms ya da saniye olabilir; ikisi de normalize edilir.
  const signedAt = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  if (!Number.isFinite(signedAt) || Math.abs(Date.now() - signedAt) > MAX_SIGNATURE_AGE_MS) {
    return reply(401, { ok: false, error: "İmza süresi geçmiş" });
  }

  let type: unknown;
  try {
    type = (JSON.parse(raw) as { _type?: unknown })?._type;
  } catch {
    return reply(400, { ok: false, error: "Geçersiz gövde" });
  }
  if (typeof type !== "string" || !knownTypes.has(type)) {
    return reply(400, { ok: false, error: "Bilinmeyen içerik türü" });
  }

  await new Promise((resolve) => setTimeout(resolve, CONSISTENCY_WAIT_MS));
  // Webhook bir Server Action dışından geldiği için veri hemen geçersiz kılınır.
  revalidateTag(type, { expire: 0 });
  return reply(200, { ok: true, revalidated: [type] });
}
