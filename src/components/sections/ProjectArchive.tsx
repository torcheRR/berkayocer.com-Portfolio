"use client";

import Link from "next/link";
import { useState } from "react";
import { kindLabel } from "@/lib/content/labels";
import type { ProjectKind } from "@/lib/content/schemas";
import { cn } from "@/lib/cn";

type Item = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  kind: ProjectKind;
  featured: boolean;
  tech: string[];
  repo?: string;
  demo?: string;
};

export function ProjectArchive({ items }: { items: Item[] }) {
  const kinds = (Object.keys(kindLabel) as ProjectKind[]).filter((k) => items.some((i) => i.kind === k));
  const [active, setActive] = useState<ProjectKind | "all">("all");
  const visible = active === "all" ? items : items.filter((i) => i.kind === active);
  const width = String(items.length).length;

  return (
    <div className="px-4 pb-6 sm:px-7 sm:pb-7">
      <div role="group" aria-label="Proje türü" className="mb-4 flex flex-wrap gap-1.5">
        {(["all", ...kinds] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={active === k}
            onClick={() => setActive(k)}
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-[11.5px] transition-colors",
              active === k ? "border-ink bg-ink text-canvas" : "border-line-2 text-ink-2 hover:text-ink",
            )}
          >
            {k === "all" ? `Tümü (${items.length})` : `${kindLabel[k]} (${items.filter((i) => i.kind === k).length})`}
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {visible.length} proje gösteriliyor
      </p>
      <ol className="border-t border-line">
        {visible.map((p) => {
          const index = items.indexOf(p) + 1;
          return (
            <li key={p.slug} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-b border-line py-4 sm:grid-cols-[64px_1fr_auto]">
              <span className="font-mono text-xs text-ink-3 tabular-nums">#{String(index).padStart(width, "0")}</span>
              <div className="min-w-0">
                <h2 className="flex flex-wrap items-baseline gap-x-2 text-[15px] font-medium">
                  <Link href={`/projeler/${p.slug}`} className="hover:text-mark">
                    {p.title}
                  </Link>
                  {p.featured ? <span className="font-mono text-[11px] text-mark">öne çıkan</span> : null}
                </h2>
                <p className="mt-1 text-[13.5px] text-ink-2">{p.summary}</p>
                <p className="mt-1.5 font-mono text-[11px] text-ink-3">{p.tech.join(" · ")}</p>
              </div>
              <div className="col-start-2 flex flex-wrap items-start gap-x-3 gap-y-1 font-mono text-xs text-ink-3 sm:col-start-3 sm:flex-col sm:items-end sm:text-right">
                <span>
                  {p.year} · {kindLabel[p.kind]}
                </span>
                <span className="flex gap-3">
                  {p.repo ? (
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" className="hover:text-ink" aria-label={`${p.title} kaynak kodu (GitHub)`}>
                      Kaynak ↗
                    </a>
                  ) : null}
                  {p.demo ? (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="hover:text-ink" aria-label={`${p.title} canlı demo`}>
                      Demo ↗
                    </a>
                  ) : null}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
