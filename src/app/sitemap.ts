import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/content";
import { site } from "@/lib/site";

// Site haritası her zaman yayımlanmış içerikten üretilir (önizleme çerezi olsa bile taslak proje girmez).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projeler`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/ozgecmisim`, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((p) => ({
      url: `${site.url}/projeler/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: p.featured ? 0.7 : 0.4,
    })),
  ];
}
