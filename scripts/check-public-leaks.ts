/**
 * Ziyaretçilere giden çıktıda önizleme izi olmadığını denetler (çerezsiz istek, yani draft mode kapalı).
 *
 *   npm run build && npm start            # ayrı terminalde
 *   npm run check:leaks                   # varsayılan http://localhost:3000
 *   npm run check:leaks -- http://localhost:3100
 *
 * Denetlenenler:
 * - Sayfalarda görünmez işaret (stega) dizisi, önizleme kilit betiği (previewLockScript), önizleme aracı yok.
 * - SANITY_API_READ_TOKEN'ın değeri HTML'de geçmiyor. Adres yerelse (localhost) istemciye giden yerel build
 *   dosyaları (.next/static) da taranır; bu tarama `npm run build && npm start` ile çalışan yerel sunucu içindir.
 *   Değer hiçbir zaman ekrana yazılmaz; yalnızca GEÇTİ/KALDI.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { previewLockScript } from "../src/lib/motion/init";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const PAGES = ["/", "/projeler", "/ozgecmisim", "/sitemap.xml", "/robots.txt"];
// Art arda 4+ sıfır genişlikli karakter: stega kodlamasının izi.
const STEGA = /[\u200B\u200C\u200D\u2060\uFEFF]{4,}/;
const token = process.env.SANITY_API_READ_TOKEN?.trim() ?? "";

let failed = 0;
const check = (ok: boolean, label: string) => {
  if (!ok) failed++;
  console.log(`${ok ? "GEÇTİ" : "KALDI"}  ${label}`);
};

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : Promise.resolve([join(dir, e.name)]))));
  return files.flat();
}

async function main() {
  // Bir proje sayfası da denetlensin: site haritasındaki ilk proje adresi.
  const sitemap = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
  const project = sitemap.match(/<loc>[^<]*(\/projeler\/[^<]+)<\/loc>/)?.[1];
  const pages = project ? [...PAGES, project] : PAGES;

  for (const path of pages) {
    const res = await fetch(`${base}${path}`, { redirect: "manual" });
    const body = await res.text();
    check(res.status === 200, `${path} 200 döndü (${res.status})`);
    check(!STEGA.test(body), `${path} görünmez işaret içermiyor`);
    check(!body.includes(previewLockScript), `${path} önizleme kilidi içermiyor`);
    check(!/PreviewTools|draft-mode\/disable/.test(body), `${path} önizleme aracı içermiyor`);
    if (token) check(!body.includes(token), `${path} okuma token'ı içermiyor`);
  }

  const enable = await fetch(`${base}/api/draft-mode/enable`, { redirect: "manual" });
  check(enable.status === 401 || enable.status === 404, `anahtarsız önizleme isteği reddedildi (${enable.status})`);
  const disable = await fetch(`${base}/api/draft-mode/disable`, { redirect: "manual" });
  check(disable.status === 405, `önizlemeden çıkış GET ile çalışmıyor (${disable.status})`);

  const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname);
  if (!token) {
    console.log("ATLANDI  SANITY_API_READ_TOKEN tanımlı değil; token taraması yapılmadı.");
  } else if (!isLocal) {
    console.log("ATLANDI  Uzak adres: istemci dosyası taraması yalnızca yerel build (.next/static) için yapılır.");
  } else {
    const files = await walk(join(process.cwd(), ".next", "static"));
    if (!files.length) {
      check(false, "istemci dosyaları bulunamadı (.next/static yok; önce npm run build)");
    } else {
      let leaked = false;
      for (const file of files) if ((await readFile(file, "utf8")).includes(token)) leaked = true;
      check(!leaked, `istemci dosyaları okuma token'ı içermiyor (${files.length} dosya)`);
    }
  }

  console.log(failed ? `\n${failed} denetim KALDI.` : "\nTüm denetimler geçti.");
  process.exitCode = failed ? 1 : 0;
}

main().catch((error) => {
  console.error("Denetim çalışamadı:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
