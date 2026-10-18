import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Row } from "@/components/ui/Frame";
import { Chip } from "@/components/ui/primitives";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { getProject, getProjects, resolveTech } from "@/lib/content";
import { kindLabel, statusLabel } from "@/lib/content/labels";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({ title: project.title, description: project.summary, path: `/projeler/${project.slug}` });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const [tech, all] = await Promise.all([resolveTech(project.tech), getProjects()]);
  const featured = all.filter((p) => p.featured);
  const pool = project.featured ? featured : all;
  const next = pool[(pool.findIndex((p) => p.slug === project.slug) + 1) % pool.length];

  const metrics = [
    { label: "Tür", value: kindLabel[project.kind] },
    { label: "Yıl", value: String(project.year) },
    { label: "Durum", value: statusLabel[project.status] },
    { label: "Stack", value: tech.map((t) => t.name).join(" · ") },
  ];

  return (
    <article>
      <Row>
        <ProjectCover mark={project.cover.mark} brand={project.cover.brand} className="aspect-[21/9] sm:aspect-[21/8]" large />
      </Row>
      <Row className="grid gap-5 px-4 py-6 sm:px-7 sm:py-8">
        <nav aria-label="Sayfa konumu" className="font-mono text-xs text-ink-3">
          <Link href="/projeler" className="hover:text-ink">
            Projeler
          </Link>{" "}
          / {project.title}
        </nav>
        <h1 className="font-mono text-[clamp(1.8rem,4.6vw,2.6rem)] leading-[1.05] font-medium tracking-[-0.045em] [overflow-wrap:anywhere]">
          {project.title}
        </h1>
        <p className="max-w-[62ch] text-[15.5px] text-ink-2">{project.summary}</p>
        {project.description ? <p className="max-w-[62ch] text-ink-2">{project.description}</p> : null}

        <dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="grid min-w-0 gap-1 rounded-[10px] border border-line bg-panel p-3">
              <dt className="font-mono text-xs text-ink-3">{m.label}</dt>
              <dd className="font-mono text-xs [overflow-wrap:anywhere]">{m.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="flex flex-wrap gap-1.5" aria-label="Kullanılan teknolojiler">
          {tech.map((t) => (
            <li key={t.slug}>
              {t.url ? (
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                  <Chip color={t.color}>{t.name}</Chip>
                </a>
              ) : (
                <Chip color={t.color}>{t.name}</Chip>
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-4 font-mono text-sm">
          {project.links.repo ? (
            <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="text-mark hover:underline">
              Kaynağı GitHub&apos;da gör ↗
            </a>
          ) : null}
          {project.links.demo ? (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-mark hover:underline">
              Canlı demo ↗
            </a>
          ) : null}
        </div>
      </Row>
      {next && next.slug !== project.slug ? (
        <Row className="flex items-center justify-between gap-4 px-4 py-5 font-mono text-xs text-ink-3 sm:px-7">
          <span>Sıradaki proje</span>
          <Link href={`/projeler/${next.slug}`} className="text-ink hover:text-mark">
            {next.title} →
          </Link>
        </Row>
      ) : null}
    </article>
  );
}
