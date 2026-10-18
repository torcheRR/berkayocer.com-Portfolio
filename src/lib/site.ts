import type { Metadata } from "next";

export type SocialLink = {
  label: "LinkedIn" | "GitHub" | "X" | "Instagram";
  href: string;
};

export const site = {
  name: "Berkay ÖCER",
  url: "https://berkayocer.com",
  title: "Berkay ÖCER | Yazılım Mühendisi",
  description:
    "İstanbul'da yaşayan yazılım mühendisi Berkay ÖCER'in portfolyosu: C#/.NET, React, TypeScript ve SQL ile geliştirdiği projeler ve deneyimleri.",
  role: "Yazılım Mühendisi",
  email: "berkayocer2003@gmail.com",
  location: "İstanbul, Türkiye",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/berkayocer" },
    { label: "GitHub", href: "https://github.com/torcheRR" },
    { label: "X", href: "https://x.com/berkayocer_" },
    { label: "Instagram", href: "https://www.instagram.com/berkayocer_/" },
  ] satisfies SocialLink[],
};

const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} · ${site.role}` };

// Sayfa bazlı metadata: openGraph üst seviyede sığ birleştirildiği için ortak alanlar burada tekrar veriliyor.
// Alt sayfaların openGraph nesnesi kökteki opengraph-image dosyasını ezdiği için görsel açıkça ekleniyor;
// kök sayfa aynı klasördeki dosyadan (hash'li URL) alıyor.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
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
      ...(path !== "/" ? { images: [ogImage] } : {}),
    },
  };
}
