import { stegaClean } from "next-sanity";
import { Row } from "@/components/ui/Frame";
import { SectionHead } from "@/components/ui/primitives";
import { ProjectArchive } from "@/components/sections/ProjectArchive";
import { getProjects, getTechMap } from "@/lib/content";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Projeler",
  description: "Berkay Öcer'in tüm projeleri: TravelWise, Disney+ klonu, C# ile attribute tabanlı log yapısı, Java masaüstü uygulamaları ve öğrenme çalışmaları.",
  path: "/projeler",
});

export default async function ProjectsPage() {
  const [projects, techMap] = await Promise.all([getProjects(), getTechMap()]);
  const items = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    label: stegaClean(p.title),
    summary: p.summary,
    year: p.year,
    kind: p.kind,
    featured: p.featured,
    tech: p.tech.map((s) => techMap.get(s)?.name ?? s),
    repo: p.links.repo,
    demo: p.links.demo,
  }));

  return (
    <Row as="section" aria-labelledby="h-projeler">
      <SectionHead fig="Arşiv" title="Projeler" count={`(${projects.length})`} id="h-projeler" as="h1" />
      <ProjectArchive items={items} />
    </Row>
  );
}
