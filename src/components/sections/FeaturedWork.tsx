import Link from "next/link";
import { Row } from "@/components/ui/Frame";
import { Icon } from "@/components/ui/Icon";
import { SectionHead, Tags } from "@/components/ui/primitives";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { kindLabel } from "@/lib/content/labels";
import type { Project, Technology } from "@/lib/content";

export function FeaturedWork({
  projects,
  techMap,
  total,
}: {
  projects: Project[];
  techMap: Map<string, Technology>;
  total: number;
}) {
  const count = String(projects.length).padStart(2, "0");
  return (
    <Row as="section" id="isler" aria-labelledby="h-isler">
      <SectionHead fig="Fig. 04" title="Seçili işler" count={`(${count})`} id="h-isler" />
      <ul className="grid grid-cols-1 gap-3 px-4 pb-3.5 md:grid-cols-2 sm:px-7 sm:pb-4">
        {projects.map((p, i) => (
          <li key={p.slug} className="min-w-0">
            {/* Link başlıkta; kartın tamamı ::after ile tıklanabilir. Böylece linkin adı yalnızca proje adı olur. */}
            <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-card border border-line bg-panel transition-colors hover:border-line-2 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-mark">
              <ProjectCover mark={p.cover.mark} brand={p.cover.brand} image={p.cover.image} className="aspect-video" />
              <div className="grid gap-2 px-[18px] pt-4 pb-[18px]">
                <div className="flex justify-between gap-2 font-mono text-xs text-ink-3">
                  <span>
                    #{String(i + 1).padStart(2, "0")}/{count} · {p.year}
                  </span>
                  <span>{kindLabel[p.kind]}</span>
                </div>
                <h3 className="text-[17px] font-medium">
                  <Link href={`/projeler/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                    {p.title}
                  </Link>
                </h3>
                <p className="text-[13.5px] text-ink-2">{p.summary}</p>
                <Tags items={p.tech.map((s) => techMap.get(s)?.name ?? s)} />
                <span aria-hidden="true" className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-3 group-hover:text-mark group-focus-within:text-mark">
                  Projeyi incele <Icon name="arrowUpRight" />
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between px-4 pt-1.5 pb-6 font-mono text-xs text-ink-3 sm:px-7 sm:pb-[26px]">
        <span>Okul ve öğrenme projeleri arşivde.</span>
        <Link href="/projeler" className="hover:text-ink">
          Tüm projeler ({total}) →
        </Link>
      </div>
    </Row>
  );
}
