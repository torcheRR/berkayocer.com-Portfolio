import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

// Site düzeyi ayarlar (metadata için senkron erişim gerekir). Kişisel içerik src/content'te.
export const site = {
  name: "Berkay Öcer",
  url: "https://berkayocer.com",
  title: "Berkay Öcer | Yazılım Mühendisi",
  role: "Yazılım Mühendisi",
  description:
    "İstanbul'da yaşayan yazılım mühendisi Berkay Öcer'in portfolyosu: C#/.NET, React, React Native, TypeScript ve SQL ile geliştirdiği web ve mobil projeler.",
};

const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} · ${site.role}` };

// openGraph üst seviyede sığ birleştirildiği için ortak alanlar burada tekrar veriliyor.
// Sayfa düzeyindeki openGraph nesnesi kökteki opengraph-image dosyasını ezdiği için görsel her sayfaya açıkça ekleniyor.
export function pageMetadata({
  title: rawTitle,
  description: rawDescription,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  // Önizlemede içerikten gelen metinler tıkla-düzenle için görünmez işaret taşır; <title> ve og:* temiz kalmalı.
  const title = rawTitle && stegaClean(rawTitle);
  const description = stegaClean(rawDescription);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: site.name,
      url: path,
      title: title ? `${title} | ${site.name}` : site.title,
      description,
      images: [ogImage],
    },
  };
}
